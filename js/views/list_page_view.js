class ListPageView 
{
    constructor(storageService, viewModel)
    {
        this.storage = storageService;
        this.viewModel = viewModel;
        this.listTemplateHtml="";
        this.wrapperTemplateHtml="";
        this.searchWaiter=null;
    }

    get list() { return this.viewModel.list; }

    get view() { return this.viewModel; }
   
    get wrapperTemplateUrl() { return this.view.wrapperTemplateUrl; }
    get $wrapperContainer() { return $("#"+this.view.wrapperContainerId); }

    get $listContainer() { return $("#"+this.view.listContainerId); }
    get listTemplateUrl() { return this.view.listTemplateUrl; }
   
    get columns(){ return this.view.list.columns; }
    
    get $alertContainer() { return $("#"+this.view.alertContainerId); }
    get $modal() { return $("#"+this.view.modalContainerId); }
    get $headerIcon() { return $(`#${this.storage.sortCol}-${this.storage.sortDir}`); }

    reset(){
        this.storage.reset();
        this.render();
    }

    async render(){
        await this.renderWrapper();
        await this.renderList();
    }

    async renderWrapper()
    {
        this.$wrapperContainer.empty();
        if (!this.wrapperTemplateHtml.length>0){
            this.wrapperTemplateHtml =  await this.getFileContents(this.wrapperTemplateUrl);
        }
        console.log(await this.getFileContents(this.wrapperTemplateUrl));
        this.$wrapperContainer.html(ejs.render(this.wrapperTemplateHtml, { view: this.viewModel }));
        console.log(await this.getFileContents(this.wrapperTemplateUrl));
        await this.bindWrapperEvents();
    }

    async renderList()
    {
        this.$listContainer.empty();
        this.data =  await this.storage.list();
 
        if (!this.listTemplateHtml.length>0){
            this.listTemplateHtml =  await this.getFileContents(this.listTemplateUrl);
        }
        this.$listContainer.html(ejs.render(this.listTemplateHtml, { view:this, data:this.data }));
        
        this.$headerIcon.show();
      
        this.bindListEvents(this.data);
    }
    
    bindListEvents(data)
    {
        let that = this;

        this.columns.forEach((col, idx)=>{
            $(`th[data-name=${col.name}]`).on("click",function(){
                var name = col.name;
                $(':nth-child(1)',this).toggle();
                $(':nth-child(2)',this).toggle();
                if($(':nth-child(1)',this).is(":visible")){
                    that.storage.sortDir = "asc";
                }
                else{
                    that.storage.sortDir = "desc";
                }
                that.storage.sortCol =  name;
                that.renderList();
            });
        });

        this.initPopover();
    }

    async bindWrapperEvents(){
        let that=this;
        let $myModal = this.$modal;

        $myModal.on("show.bs.modal", function(ev){
        
            var button = ev.relatedTarget

            var teamId = $(button).attr("data-id");
            var teamName = $(button).attr("data-name");
            
            var $modalTitle = $('.modal-title');
      
            $modalTitle.text(`Delete ${teamName}?`);
            $myModal.attr("data-id", teamId);
            $myModal.attr("data-name", teamName);
        });

        $("#yesButton").click((e) =>{
            let itemName=$myModal.attr("data-name");
            let itemId = $myModal.attr("data-id");

            this.addAlert(this.view.entitySingle, itemName);

            this.deleteListItem(itemId)
            .then(()=>{
                this.renderList();  
            });
        });
        
        $('#resetView').on("click", (e) => {
            this.reset();
        });

        $('#searchInput').on("input", (e) => {
            this.searchVal = $(e.target).val();
            this.runSearch();
        });
        
        $('#clearSearch').off("click").on("click", (e) => {
            $('#searchInput').val("");
            this.storage.filterStr = "";
            this.renderList();
        });
    }
  
    addAlert(itemType, itemName){
        let alertHtml=`<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>You deleted the following ${itemType}: ${itemName}</span>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
        this.$alertContainer.html(alertHtml);
    }

    runSearch(){
        clearTimeout(this.searchWaiter);
        this.searchWaiter = setTimeout(() => {
            if (this.searchVal.length > 1) {
              this.storage.filterStr = this.searchVal;
              this.storage.filterCol=this.storage.sortCol;
              this.renderList();
            } 
        }, 250);
    }

    async deleteListItem(id)
    {
        await this.storage.delete(id);
        await this.renderList();
    }

    initPopover(){
        var that = this;
        $('[data-bs-toggle="popover"]').popover({
            html: true,
            trigger : 'hover',
            title : function(){
                var item = that.viewModel.data[$(this).attr("data-id")];
                return `<img class="img-fluid rounded-circle" src="${item[that.viewModel.list.logoCol]}" width="40" height="40"> ${item[that.viewModel.list.nameCol]}`;
            },
            content : function() {
                let item = that.viewModel.data[$(this).attr("data-id")];
                let htmlContent="";
                that.columns.forEach((col, idx)=>{
                    if (col.popover != "false"){
                        htmlContent+=`<p>${col.label}: ${item[col.name]}</p>`;
                    }
                })
                return htmlContent;
            }
        });
    }

    async getFileContents(url){
        return await $.get(url);
    }
}