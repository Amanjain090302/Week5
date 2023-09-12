alert("Hello Aman");



$(function() { //Same as document.addEventListner("DOMContentLoaded")

    // Same as document.querySelector("#navbarToggle").addEventListner("blur", function(event)
    // {var screenWidth = window.innerWidth;
    // if (screenWidth < 768) {
    //     $("#collapsable-nav").collapse('hide');
    // }})

    $("#navbarToggle").blur(function(event) {
        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#bs-example-navbar-collapse-1").collapse('hide');
        }
    });
});

(function(global) {
    var AC = {}

    var homeHtml = "HomePage.html";
    var allCategoriesUrl = "http://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
    var categoryHtml = "MenuCategories.html";
    var categoriesTitleHtml = "MenuCategories-Title.html";

    var menuItemsUrl =
        "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
    var menuItemsTitleHtml = "SingleMenu-Title.html";
    var menuItemHtml = "SingleMenu.html";


    //convinience function for inserting innerHTML for 'select'
    var insertHtml = function(selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    //show loading icon inside element identified by 'selector'.
    var showLoading = function(selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/Spinner-1s-200px.gif'>";
        insertHtml(selector, html);
    }


    //Return Substitute of '{{propName}}'
    // with propValue in given 'string'
    var insertProperty = function(str, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        console.log(str);
        str = str.replace(new RegExp(propToReplace, "g"), propValue);
        return str;
    }

    // Remove the class 'active' from home and switch to Menu button
    var switchMenuToActive = function() {
        // Remove 'active' from home button
        var classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp("active", "g"), "");
        document.querySelector("#navHomeButton").className = classes;

        // Add 'active' to menu button if not already there
        classes = document.querySelector("#navMenuButton").className;
        if (classes.indexOf("active") === -1) {
            classes += " active";
            document.querySelector("#navMenuButton").className = classes;
        }
    };


    //On page Load (before image or CSS) if script is writen in <head> tag then wrtie below line to wait for whole page to load

    //document.addEventListener("DOMContentLoadedM", function(event) {

    //On first Load Show home view
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(homeHtml, function(responseText) {
        document.querySelector("#main-content")
            .innerHTML = responseText;
    }, false)

    //load the menu categories view
    AC.loadMenuCategories = function() {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl, buildAndShowCategoriesHTML
        );
    }

    function buildAndShowCategoriesHTML(categories) {
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function(categoriesTitleHtml) {
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function(categoryHtml) {
                        var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
                        insertHtml("#main-content", categoriesViewHtml);
                    }, false);
            },
            false);
    }

    //Using Categories data and snippet html
    //build categories view HTML to be inserted into page

    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(categories,
        categoriesTitleHtml,
        categoryHtml) {

        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        // Loop over categories
        for (var i = 0; i < categories.length; i++) {
            // Insert category values
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html =
                insertProperty(html, "name", name);
            html =
                insertProperty(html,
                    "short_name",
                    short_name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    // Using category and menu items data and snippets html
    // build menu items view HTML to be inserted into page
    function buildMenuItemsViewHtml(categoryMenuItems,
        menuItemsTitleHtml,
        menuItemHtml) {

        menuItemsTitleHtml =
            insertProperty(menuItemsTitleHtml,
                "name",
                categoryMenuItems.category.name);
        menuItemsTitleHtml =
            insertProperty(menuItemsTitleHtml,
                "special_instructions",
                categoryMenuItems.category.special_instructions);

        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";

        // Loop over menu items
        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for (var i = 0; i < menuItems.length; i++) {
            // Insert menu item values
            var html = menuItemHtml;
            html =
                insertProperty(html, "short_name", menuItems[i].short_name);
            html =
                insertProperty(html,
                    "catShortName",
                    catShortName);
            html =
                insertItemPrice(html,
                    "price_small",
                    menuItems[i].price_small);
            html =
                insertItemPortionName(html,
                    "small_portion_name",
                    menuItems[i].small_portion_name);
            html =
                insertItemPrice(html,
                    "price_large",
                    menuItems[i].price_large);
            html =
                insertItemPortionName(html,
                    "large_portion_name",
                    menuItems[i].large_portion_name);
            html =
                insertProperty(html,
                    "name",
                    menuItems[i].name);
            html =
                insertProperty(html,
                    "description",
                    menuItems[i].description);

            // Add clearfix after every second menu item
            if (i % 2 !== 0) {
                html +=
                    "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }

            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    // Appends price with '$' if price exists
    function insertItemPrice(html,
        pricePropName,
        priceValue) {
        // If not specified, replace with empty string
        if (!priceValue) {
            return insertProperty(html, pricePropName, "");
        }

        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }


    // Appends portion name in parens if it exists
    function insertItemPortionName(html,
        portionPropName,
        portionValue) {
        // If not specified, return original string
        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }

        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }
    // });
    global.$AC = AC;
})(window);

// document.getElementById(elementsId).setAttribute("style","wi‌​dth: 500px; background-color: yellow;");