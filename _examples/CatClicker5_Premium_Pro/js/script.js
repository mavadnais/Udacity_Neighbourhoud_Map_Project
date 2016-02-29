var CatListView = function(catClickerOctopus){
    this.catClickerOctopus = catClickerOctopus;
    this.listContainerDiv = $('#cat_list');
};

CatListView.prototype.Render = function() { 
    var catsArray = this.catClickerOctopus.GetCatsArray();
    this.listContainerDiv.html('');
    for (var i = 0; i < catsArray.length; i++)
    {
        this.listContainerDiv.append('<div class="cat_list_name" id="cat_list_name_' + i + '">' + catsArray[i].name + '</div>');        
        this.SetListNameClickCallback(i);
    }
};

CatListView.prototype.SetListNameClickCallback = function(i) {
    var that = this;
    $('#cat_list_name_' + i).click(function(e) {
        that.catClickerOctopus.SetCurrentCatID(i);
    });
}

var CatDisplayView = function(catClickerOctopus){
    this.catClickerOctopus = catClickerOctopus;
    this.scoreDiv = $('#cat_score');
    this.nameDiv = $('#cat_name');
    this.image = $('#cat_image');
    
    var that = this;
    this.image.click(function(e) {
        that.catClickerOctopus.IncrementCurrentCatScore();
    });
};

CatDisplayView.prototype.Render = function() {
    var currentCat = this.catClickerOctopus.GetCurrentCat();
    this.nameDiv.text('Name: ' + currentCat.name);
    this.image.attr('src', currentCat.imageFile);
    this.RenderScore(currentCat);
};

CatDisplayView.prototype.RenderScore = function() {
    var currentCat = this.catClickerOctopus.GetCurrentCat();
    this.scoreDiv.text('Score: ' + currentCat.score);
};

var CatAdminView = function(catClickerOctopus) {
    this.catClickerOctopus = catClickerOctopus;
    this.isAdminViewVisible = false;
    
    this.adminButton = $('#admin_button');
    var that = this;
    this.adminButton.click(function(e) {
        that.ToggleAdminViewVisibility();
    });
    
    this.adminView = $('#admin_view');
    
    this.cancelButton = $('#admin_cancel_button');
    this.cancelButton.click(function(e) {
        that.DoCancelOperation();
    });
    
    this.saveButton = $('#admin_save_button');
    this.saveButton.click(function(e) {
        that.DoSaveOperation();
    });
    
    this.nameInput = $('#admin_cat_name');
    this.imageInput = $('#admin_cat_image');
    this.scoreInput = $('#admin_cat_score');
};

CatAdminView.prototype.ToggleAdminViewVisibility = function() {
    this.isAdminViewVisible = ! this.isAdminViewVisible;
    this.Render();
};

CatAdminView.prototype.DoCancelOperation = function() {
    this.RenderFormWithCurrentCat();
};

CatAdminView.prototype.DoSaveOperation = function() {
    var newCatName = this.nameInput.val();
    var newCatImage = this.imageInput.val();
    var newCatScore = this.scoreInput.val();
    this.catClickerOctopus.UpdateCurrentCatInfo(newCatName, newCatImage, newCatScore);
};

CatAdminView.prototype.ToggleAdminViewVisibility = function() {
    this.isAdminViewVisible = ! this.isAdminViewVisible;
    this.Render();
};

CatAdminView.prototype.Render = function() {
    if (this.isAdminViewVisible)
        this.adminView.show();
    else
        this.adminView.hide();
    
    this.RenderFormWithCurrentCat();
};

CatAdminView.prototype.RenderFormWithCurrentCat = function() {
    var currentCat = this.catClickerOctopus.GetCurrentCat();
    this.nameInput.val(currentCat.name);
    this.imageInput.val(currentCat.imageFile);
    this.scoreInput.val(currentCat.score);
};

var CatModel = function(){
    this.catsArray = [];
    this.catsArray[0] = new Cat("Muffins", "images/cat.jpg");
    this.catsArray[1] = new Cat("Clementine", "images/cat2.jpg");
    this.catsArray[2] = new Cat("Sam", "images/cat3.jpg");
    this.catsArray[3] = new Cat("Missy", "images/cat4.jpg");
    this.catsArray[4] = new Cat("Black", "images/cat5.jpg");
    this.catsArray[5] = new Cat("Orange", "images/cat6.jpg");
    this.catsArray[6] = new Cat("Grey", "images/cat7.jpg");
    this.catsArray[7] = new Cat("Panda", "images/cat8.jpg");
    this.currentCatID = 0;
};

CatModel.prototype.SetCurrentCatID = function(catID) {
    this.currentCatID = catID;
};

CatModel.prototype.GetCurrentCatName = function() {
    return this.catsArray[this.currentCatID].name;
};

CatModel.prototype.GetCurrentCatImage = function() {
    return this.catsArray[this.currentCatID].image;
};

CatModel.prototype.GetCurrentCatScore = function() {
    return this.catsArray[this.currentCatID].score;
};

CatModel.prototype.IncrementCurrentCatScore = function() {
    this.catsArray[this.currentCatID].score++;
};

CatModel.prototype.UpdateCurrentCatInfo = function(newCatName, newCatImage, newCatScore) {
    this.catsArray[this.currentCatID].name = newCatName;
    this.catsArray[this.currentCatID].imageFile = newCatImage;
    this.catsArray[this.currentCatID].score = newCatScore;
};

CatModel.prototype.GetCatNameByID = function(catID) {
    return this.catsArray[catID].name;
};

CatModel.prototype.GetCatImageByID = function(catID) {
    return this.catsArray[catID].image;
};

CatModel.prototype.GetCatScoreByID = function(catID) {
    return this.catsArray[catID].score;
};

CatModel.prototype.IncrementCatScoreByID = function(catID) {
    this.catsArray[catID].score++;
};

CatModel.prototype.GetCatsArray = function() {
    return this.catsArray;
};

CatModel.prototype.GetCurrentCat = function() {
    return this.catsArray[this.currentCatID];
};

var CatClickerOctopus = function(){
    this.catModel = new CatModel();
    
    this.catListView = new CatListView(this);
    this.RenderCatList();
    
    this.catDisplayView = new CatDisplayView(this);
    this.RenderCatDisplay();
    
    this.catAdminView = new CatAdminView(this);
    this.catAdminView.Render();
};

CatClickerOctopus.prototype.SetCurrentCatID = function(catID) {
    this.catModel.SetCurrentCatID(catID);
    this.RenderCatDisplay();
    this.catAdminView.Render();
};

CatClickerOctopus.prototype.IncrementCurrentCatScore = function() {
    this.catModel.IncrementCurrentCatScore();
    this.catDisplayView.RenderScore();
};

CatClickerOctopus.prototype.RenderCatList = function() {
    this.catListView.Render();
};

CatClickerOctopus.prototype.RenderCatDisplay = function() {
    this.catDisplayView.Render();
};

CatClickerOctopus.prototype.GetCatsArray = function() {
    return this.catModel.GetCatsArray();
};

CatClickerOctopus.prototype.GetCurrentCat = function() {
    return this.catModel.GetCurrentCat();
};

CatClickerOctopus.prototype.UpdateCurrentCatInfo = function(newCatName, newCatImage, newCatScore) {
    this.catModel.UpdateCurrentCatInfo(newCatName, newCatImage, newCatScore);
    this.RenderCatDisplay();
    this.RenderCatList();
};

var Cat = function(name, imageFile)
{
    this.name = name;
    this.imageFile = imageFile;
    this.score = 0;
};

var catClicker = new CatClickerOctopus();
