/*
    TODO:
       - SEND TOKEN ALL THE TEIM - *ok*
       - add/test ios and android *ok*
       - birthday has passed *ok*
       - validation
       
       
        In the FrontEnd
        - Validation
        - Improve CSS
*/


let log = console.log;
let KEY = "MAGA0030";
//let TOKEN = "Token";
let token = "";
let device_id = 123456789;
let test_token = "401fa6e96bd8a65743fef646cbf8289327102cb4";
var app = {
    Persons: [],
    Gifts: [],
    Token: "",
    UserID: "",
    init: function () {
                                localStorage.clear();
//        if (localStorage.getItem(KEY)) {
//            app.Persons = JSON.parse(localStorage.getItem(KEY));
//        } else {
//            app.createPersonListItem({
//                id: Date.now(),
//                name: "Olive Son",
//                dob: app.dateToString("02", "25", "2002")
//            });
//
//            app.createPersonListItem({
//                id: Date.now(),
//                name: "Gary Son",
//                dob: app.dateToString("09", "03", "1980")
//            });
//
//            app.createPersonListItem({
//                id: Date.now(),
//                name: "Havana Son",
//                dob: app.dateToString("02", "25", "1982")
//            });
//        }

        // token set
        //localStorage.setItem(TOKEN, token);

        // token get
        //token = localStorage.getItem('app-token');

        // get the token
        app.connect();


        
        

        app.setNavigation();
        app.switchPage("people-list");
    }, 
    
    connect: function () {
        //myHeaders.append("X-Custom-Header", "AnotherValue")
        fetch("https://maga0030.edumedia.ca/api/connect", {
        //fetch("http://localhost:8000/api/connect", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Device-ID': app.device_id,
                'Username': "Kannonball",
                'Password': "hoetown"
            },
            mode: 'cors',
        })
        .then(response => response.json())
        .then(data => {
            log(data);
            app.Token = data.data.token;
            app.UserID = data.data.user_id;

            app.fetchPeople();
            app.fetchGifts();
        })
        .catch(err => {
            console.log(err);
        });
    },

    fetchPeople: function () {
        fetch("https://maga0030.edumedia.ca/api/people", {
       // fetch("http://localhost:8000/api/people", {
                method: 'GET',
                headers: {
                    'Token': app.Token
                },
                mode: 'cors'
            })
            .then(response => response.json())
            .then(data => {
                log(data);
                //log("this should work: " + app.token);
                app.DATA = data.data.original;
                app.Persons = data.data.original;
                app.buildList();
            
                //month, day, year
                let month = "10";
                let day = "12";
                let year = "1983";
            
                
                //                console.log(app.DATA);
            })
            .catch(err => {
                console.log(err);
            });
    },

    fetchGifts: function () {
        fetch("https://maga0030.edumedia.ca/api/gifts", {
        //fetch("http://localhost:8000/api/gifts", {
            method: 'GET',
            headers: {
                'Token': app.Token
            },
            mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
            app.DATA = data;
            app.Gifts = data.data;
            console.log(app.DATA);
        })
        .catch(err => {
            console.log(err);
        });
    },
    
    addPersonToDatabase: function (name, dob) {        
         fetch("https://maga0030.edumedia.ca/api/people", {
        //fetch("http://localhost:8000/api/people", {
            method: 'POST',
            headers: {
                'Token': app.Token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "person_id": Date.now(),
                "user_id": app.UserID,
                "dob": dob,
                "person_name": name
            })
        })
        .then(response => response.json())
        .then(data => {
            log(data);
            app.Persons.push(data.data);
            app.buildList();
            //app.createPersonListItem(data.data);
            
        })
        .catch(err => {
            log(err); 
        });
    },
    
    updatePersonFromDatabase: function (name, dob, id) {
//        log("Name: " + name);
//        log("Id: " + id);
//        log("Date of birth: " + app.stringToDate(dob));
        
        fetch("https://maga0030.edumedia.ca/api/people/" + id, {
        //fetch("http://localhost:8000/api/people/" + id, {
            method: 'PUT',
            headers: {
                'Token': app.Token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "dob": app.stringToDate(dob),
                "person_name": name
            })
        })
        .then(response => response.json())
        .then(data => {
            log(data);
            app.fetchPeople();
            //app.buildList();
        })
        .catch(err => {
            log(err); 
        }); 
    },
    
    deletePersonFromDatabase: function(obj) {
        fetch("https://maga0030.edumedia.ca/api/people/" + obj.person_id, {
        //fetch("http://localhost:8000/api/people/" + obj.person_id, {
            'Token': app.Token,
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            log(data);
            app.Persons = app.Persons.filter(person => person.person_id != obj.person_id);
            app.buildList();
            //app.Persons.push(data.data);
            //app.createPersonListItem(data.data);
        })
        .catch(err => {
            log(err); 
        });
    },
    
    addGiftToDatabase: function (obj) {  
        log("in AG: " + obj.person_id);
        let index = app.Persons.findIndex(person => person.person_id == obj.person_id);
        log(app.Persons[index]);
        
        if (obj.gift_url) {
           if (!/^(f|ht)tps?:\/\//i.test(obj.gift_url)) {
               obj.gift_url = "http://" + obj.gift_url;
           }
        }
        
        fetch("https://maga0030.edumedia.ca/api/gifts", {
        //fetch("http://localhost:8000/api/gifts", {
            method: 'POST',
            headers: {
                'Token': app.Token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "person_id": obj.person_id,
                "gift_id": obj.gift_id,
                "gift_price": obj.gift_price,
                "gift_store": obj.gift_store,
                "gift_title": obj.gift_title,
                "gift_url": obj.gift_url
            })
        })
        .then(response => response.json())
        .then(data => {
            log(data);
            let index = app.Persons.findIndex(person => person.person_id == obj.person_id);

            app.Gifts.push(obj);

            //localStorage.setItem(KEY, JSON.stringify(app.Persons));
            app.buildGiftList(app.Persons[index].person_id);
        })
        .catch(err => {
            log(err); 
        });
    },
    
    deleteGiftFromDatabase: function(obj) {
        //app.Gifts = app.Gifts.filter(gift => gift.gift_id != obj.gift_id);
        //log("gift_id: " + obj.gift_id);
        //log(app.Gifts.filter(gift => gift.gift_id != obj.gift_id));
        fetch("https://maga0030.edumedia.ca/api/gifts/" + obj.gift_id, {
        //fetch("http://localhost:8000/api/gifts/" + obj.gift_id, {
            
            method: 'DELETE',
            headers: {
                'Token': app.Token,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            log(data);
            app.Gifts = app.Gifts.filter(gift => gift.gift_id != obj.gift_id);
            app.buildGiftList(obj.person_id);
            //app.Persons.push(data.data);
            //app.createPersonListItem(data.data);
        })
        .catch(err => {
            log(err); 
        });
    },

    setNavigation: function () {
        ///////////////////////////////////
        // People-List
        //////////////////////////////////

        let add_person_btn = document.querySelector(".floating-button");
        //        let gift_btn = document.getElementById("gift-btn");



        add_person_btn.addEventListener("click", (ev) => {
            ev.preventDefault();
            app.clearForm("person");
            scrollTo(0, 0);
            app.switchPage("form", "people-list");
            log(document.querySelectorAll(".active").length);
        });

        //        gift_btn.addEventListener("click", (ev) => {
        //            ev.preventDefault();
        //            app.switchPage("gift-list", "people-list");
        //        });

        ///////////////////////////////////
        // Gift-List
        //////////////////////////////////

        let back_btn = document.getElementById("back-btn");
        let add_gift_btn = document.getElementById("add-gift-btn");
        let delete_btn = document.getElementById("delete");

        back_btn.addEventListener("click", (ev) => {
            ev.preventDefault();
            //remove id
            document.getElementById("add-gift-btn").setAttribute("data-id", "");
            app.switchPage("people-list", "gift-list");
        });

        add_gift_btn.addEventListener("click", (ev) => {
            ev.preventDefault();
            //scrollTo(0, 0);
            app.clearForm("gift");
            app.switchPage("add-gift", "gift-list");
        });

        delete_btn.addEventListener("click", (ev) => {
            // delete and rebuild list
            ev.preventDefault();
            log("DELETE");
        });


        ///////////////////////////////////
        // Form
        //////////////////////////////////

        let cancel_person_btn = document.getElementById("form-cancel");
        let save_person_btn = document.getElementById("form-save");

        cancel_person_btn.addEventListener("click", (ev) => {
            ev.preventDefault();
            app.switchPage("people-list", "form");
        });

        save_person_btn.addEventListener("click", (ev) => {
            ev.preventDefault();
            app.savePersonForm();
            app.switchPage("people-list", "form");
        });


        ///////////////////////////////////
        // Add-List
        //////////////////////////////////

        let cancel_gift_btn = document.getElementById("add-cancel");
        let save_gift_btn = document.getElementById("add-save");

        cancel_gift_btn.addEventListener("click", (ev) => {
            ev.preventDefault();
            app.switchPage("gift-list", "add-gift");
        });

        save_gift_btn.addEventListener("click", (ev) => {
            ev.preventDefault();
            app.saveGiftForm();
            app.switchPage("gift-list", "add-gift");
        });
    },

    switchPage: function (name, old_page = "") {
        if (old_page) document.getElementById(old_page).classList.remove("active");
        document.getElementById(name).classList.add("active");
    },

    savePersonForm: function () {
        let name = document.getElementById("name").value;
        let month = document.getElementById("MM").value;
        let day = document.getElementById("DD").value;
        let year = document.getElementById("YYYY").value;
  

        if (name && day && month && year) {
            console.log("Form completed");
            if (document.getElementById("name").getAttribute("data-id")) { // exists already
                let id = document.getElementById("name").getAttribute("data-id")
                let index = app.Persons.findIndex(obj => obj.person_id == id);
                //log("id: " + id);
                app.Persons[index].person_name = name;
                app.Persons[index].dob = app.dateToStringMDYString(month, day, year);
                app.updatePersonFromDatabase(name, app.Persons[index].dob, id);
                
            } else { // create person
                let dob = app.dateToStringMDYString(month, day, year);
                let obj = {
                    id: Date.now(),
                    name: name,
                    dob: dob,
                    gifts: []
                };
                
                
                app.addPersonToDatabase(name, app.stringToDate(dob));
                
                //localStorage.setItem(KEY, JSON.stringify(app.Persons));
            }
        } else {
            app.showOverlay("error", "Error: Input Not Filled Correctly. Data Not saved.");
        } 

        log(app.Persons);

    },

    fillPersonForm: function (name, date, id) {
        document.getElementById("name").value = name;
        document.getElementById("name").setAttribute("data-id", id);
        document.getElementById("MM").value = date.month;
        document.getElementById("DD").value = date.day;
        document.getElementById("YYYY").value = date.year;
    },

    clearForm: function (type) {
        if (type == "person") {
            document.getElementById("name").value = "";
            document.getElementById("name").setAttribute("data-id", "");
            document.getElementById("MM").value = "";
            document.getElementById("DD").value = "";
            document.getElementById("YYYY").value = "";
        } else if (type == "gift") {
            document.getElementById("idea").value = "";
            document.getElementById("idea").setAttribute("data-id", "");
            document.getElementById("price").value = "";
            document.getElementById("location").value = "";
            document.getElementById("url").value = "";
        }
    },

    saveGiftForm: function () {
        // get gifts array from person id
        let gift = document.getElementById("idea").value;
        let price = document.getElementById("price").value;
        let location = document.getElementById("location").value;
        let url = document.getElementById("url").value;

        let id = document.getElementById("add-gift-btn").getAttribute("data-id");
        var url_pattern = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        

        if (gift) {
            let obj = {
                    person_id: id,
                    gift_id: Date.now(),
                    gift_title: gift,
                    gift_price: price,
                    gift_store: location,
                    gift_url: url
            };
            
            if (url) {
                if (!url_pattern.test(url)) {
                   app.showOverlay("error", "Error: URL input is wrong. Data Not saved.");
                } else {
                   app.addGiftToDatabase(obj);  
                }
            } else {
                console.log("Form completed");
                

                app.addGiftToDatabase(obj);  
            }
                
        } else {
            app.showOverlay("error", "Error: GiftName Not Filled. Data Not saved.");
        }
    },

    createPersonListItem: function (obj) {
        //        <li class="people-list-item">
        //                <div class="list-text">
        //                    <h1>Ollie Oh</h1>
        //                    <p>Feb 25, 1998</p>  
        //                </div>
        //                
        //                <div class="list-buttons">
        //                    <span class="fa fa-trash fa-lg" id="del-btn"></span>  
        //                    <span class="fa fa-gift fa-2x" id="gift-btn"></span>
        //                      
        //                </div>
        //                
        //        </li>

        let list = document.querySelector(".people-list-view");
        let df = document.createDocumentFragment();

        let li = document.createElement("li");
        let text_div = document.createElement("div");
        let button_div = document.createElement("div");
        let h1 = document.createElement("h1");
        let p = document.createElement("p");

        let gift = document.createElement("span");
        let del = document.createElement("span");

        h1.textContent = obj.person_name;
        p.textContent = app.dateToString(obj.dob);
        let today = moment([2010, 6, 10]);
        let CurrentDateFormat = moment().format("YYYY-MM-DD");

        li.setAttribute("class", "people-list-item");

        text_div.setAttribute("class", "list-text");
        button_div.setAttribute("class", "list-buttons");

        gift.setAttribute("id", "gift-btn");
        del.setAttribute("id", "del-btn");
        gift.setAttribute("class", "fa fa-gift fa-2x");
        del.setAttribute("class", "fa fa-trash fa-lg");

        gift.setAttribute("data-id", obj.person_id);

        text_div.appendChild(h1);
        text_div.appendChild(p);

        button_div.appendChild(del);
        button_div.appendChild(gift);

        li.appendChild(text_div);
        li.appendChild(button_div);

        h1.addEventListener("click", (ev) => {
            ev.preventDefault();
            app.switchPage("form", "people-list");
            scrollTo(0, 0);
            log("this: " + obj.dob);
            app.fillPersonForm(obj.person_name, app.dateToStringMDY(obj.dob), obj.person_id);
        });

        gift.addEventListener("click", (ev) => {
            ev.preventDefault();
            scrollTo(0, 0);
            document.getElementById("add-gift-btn").setAttribute("data-id", obj.person_id);
            app.buildGiftList(app.Persons[app.Persons.findIndex(p => p.person_id == obj.person_id)].person_id);
            app.switchPage("gift-list", "people-list");
        });

        del.addEventListener("click", (ev) => {
            ev.preventDefault();
            app.deletePersonListItem(obj);
//            log(obj.person_id);
            log("DELETE");
        });

        df.appendChild(li);
        list.appendChild(df);
    },

    deletePersonListItem: function (obj) {
        let person = app.Persons.find(person => person.person_id == obj.person_id);
        log(person);
        
        app.deletePersonFromDatabase(person);
        
        //app.Persons = app.Persons.filter(person => person.person_id != obj.id);
        
        //localStorage.setItem(KEY, JSON.stringify(app.Persons));
        
    },

    buildList: function () {
        document.querySelector(".people-list-view").innerHTML = "";
        
        app.Persons.sort(function(a, b){
            let a1 = parseInt(app.dateToStringMDY(a.dob).month);
            let b1 = parseInt(app.dateToStringMDY(b.dob).month);
            return parseFloat(a1) - parseFloat(b1);
        });
        
        app.Persons.forEach(person => {
            app.createPersonListItem(person);
        });
    },
    // use person's id to create gift list item
    buildGiftList: function (person_id) {
        log("buildGiftList Function");
        document.querySelector(".gift-list-view").innerHTML = "";
        app.Gifts.forEach(gift => {
            //log(gift.person_id + " = " + person.person_id);
            //app.createGiftListItem(gift);
            if (gift.person_id == person_id) app.createGiftListItem(gift);
        });
    },

    createGiftListItem: function (obj) {
        //log("create");
        //        <li>
        //            <h1 class="gift-title">DAMN. Vinyl</h1>
        //            <p class="gift-price">$29.99</p>
        //            <p class="gift-location">Amazon</p>
        //            <p><a href="#" target="_blank" class="gift-url">amazon.ca</a></p>
        //            <div><button id="delete"> ⃠</button></div>
        //        </li>
        let list = document.querySelector(".gift-list-view");
        let df = document.createDocumentFragment();

        let li = document.createElement("li");
        let h1 = document.createElement("h1");
        let p_price = document.createElement("p");
        let p_location = document.createElement("p");
        let p_url = document.createElement("p");
        let a = document.createElement("a");
        let button_div = document.createElement("div");
        let button = document.createElement("button");

        h1.classList.add("gift-title");
        h1.textContent = obj.gift_title;

        p_price.classList.add("gift-price");
        let price = obj.gift_price;
        if (price !== "" && price != "0.00") {
            price = "$" + price;
            p_price.textContent = price;
        } else {
            p_price.textContent = "";
        }
        
        

        p_location.classList.add("gift-location");
        p_location.textContent = obj.gift_store;

        a.setAttribute("href", obj.gift_url);
        a.setAttribute("target", "_blank");
        a.classList.add("gift-url");
        
        
        a.textContent = obj.gift_url;
        
       

        button.classList.add("delete");
        button.textContent = "X";

        p_url.appendChild(a);
        button_div.appendChild(button);

        li.appendChild(h1);
        li.appendChild(p_price);
        li.appendChild(p_location);
        li.appendChild(p_url);
        li.appendChild(button_div);
        
        button.addEventListener("click", (ev) => {
            ev.preventDefault();
            app.deleteGiftListItem(obj);
//            log(obj.person_id);
            log("DELETE");
        });

        df.appendChild(li);

        list.appendChild(df);
    },
    
    deleteGiftListItem: function (obj) {
        let gift = app.Gifts.find(gift => gift.gift_id == obj.gift_id);
        log(gift);
        
        app.deleteGiftFromDatabase(gift);
    },

    dateToStringMDYString: function (month, day, year) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        //log(months[parseInt(month) - 1] + " " + day + ", " + year);
        
        return months[parseInt(month) - 1] + " " + day + ", " + year;
    },
    
    dateToStringMDY: function (dob) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        let date = dob.split("-");

        return {
            year: date[0],
            month: date[1],
            day: date[2]
        };
    },
    
    dateToString: function (dob) {
        let date = moment(dob);
        var now = moment();
        
        date.year(now.year());
        
        let months = date.diff(now, "months");
        let days = date.diff(now, "days");
        let datePassed = "";
        
        if (days < 0) {
            if (days < -30) datePassed = ", " + Math.abs(months) + " months ago";
            else datePassed = ", " + Math.abs(days) + " days ago";
        } else if (days == 0) datePassed = "Happy Birthday!";
        
        
        return date.format("MMMM DD") + datePassed;
        //return months[parseInt(str[1]) - 1] + " " + str[2] + ", " + str[0];
    },
    
    stringToDate: function (dob) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//        log("date: " + dob);
        let date = dob.split(/[ ,]+/);
        //log("first index: " + date[0]);
        let monthIndex = months.indexOf(date[0]) + 1;
        if (monthIndex < 10) {
             date[0] = '0' + monthIndex;
        } else date[0] = monthIndex.toString();
       
        return date[2] + "-" + date[0] + "-" + date[1];
    },
    
    showOverlay: function (type, message) {
        document.querySelector(".overlay-bars").classList.remove("hidden");
        let h1 = document.querySelector(".overlay-bars h1");
        
        
        h1.setAttribute("class", type + " t2");
        h1.textContent = message;
        
        setTimeout(function () {
            document.querySelector(".overlay-bars").classList.add("hidden");
        }, 1000);
    },

//    stringToDate: function (dob) {
//        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//
//        let date = dob.split(/[ ,]+/);
//        return ['0' + (months.indexOf(date[0]) - 1), date[1], date[2]];
//
//
//    }

};

let deviceready = ('deviceready' in document) ? 'deviceready' : 'DOMContentLoaded';

document.addEventListener(deviceready, app.init);
