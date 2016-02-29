var initialCats = [
    {
        name: 'Tabby',
        clickCount: 0,
        imgSrc: 'img/434164568_fea0ad4013_z.jpg',
        imgAttribution: 'https://www.flickr.com',
        nicknames: [
            {nickname: 'Mittens'},
            {nickname: 'Assface'},
            {nickname: 'Bumface'}
        ]
    },
    {
        name: 'John',
        clickCount: 0,
        imgSrc: 'img/22252709_010df3379e_z.jpg',
        imgAttribution: 'https://www.twitter.com',
        nicknames: [
            {nickname: 'Johny'}
        ]
    }
];

var Cat = function(data) {
    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
    this.imgSrc = ko.observable(data.imgSrc);
    this.imgAttribution = ko.observable(data.imgAttribution);  
    this.nicknames = ko.observableArray(data.nicknames);
    
    this.level = ko.computed(function() {
        if (this.clickCount() < 10)
            return 'Newborn';
        else if (this.clickCount() < 20)
            return 'Infant';
        return 'Ninja';
    }, this);
};

var ViewModel = function() {
    //var that = this;
    var self = this;
    
    this.catList = ko.observableArray([]);
    
    initialCats.forEach(function(catItem) {
        self.catList.push(new Cat(catItem));
    });
    
    this.currentCat = ko.observable(this.catList()[0]);
    
    this.incrementCounter = function() {
        //that.currentCat().clickCount(that.currentCat().clickCount() + 1);
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };
    
    this.setCurrentCat = function(clickedCat) {
        self.currentCat(clickedCat);   
    };
};

ko.applyBindings(new ViewModel());