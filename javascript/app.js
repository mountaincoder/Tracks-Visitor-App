$(function(){               
    $(window).on('resize', resize_appui);   
    
    $("#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID).hammer({ dragLockToAxis: true });
    $(document).off("tap", "#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID); 
    $(document).on("tap", "#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID, function(){   
        if($("#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID).hasClass('back')){                                    
            showOrHideAndSaveContent(false);  
            $("#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID).removeClass('back');  
            $("#" + APP_UI_CONTAINER_ELEMENT_ID).removeClass('donation_page');   
            $("#" + APP_UI_FOOT_CONTAINER_ELEMENT_ID).removeClass('donation_page'); 
                 
            $('.ContentInner .ListItem').each(function(){                      
                $(this).hammer({ dragLockToAxis: true });             
                $(document).off("tap", '#' + $(this).attr('id')); 
                $(document).on("tap", '#' + $(this).attr('id'), function(){       
                    getAnimalDetail($(this).attr("id").replace("Animal", ""));
                });
            });      
        }
    });  
    
    $("#" + APP_UI_FOOT_CONTAINER_ELEMENT_ID).hammer({ dragLockToAxis: true });
    $(document).off("tap", "#" + APP_UI_FOOT_CONTAINER_ELEMENT_ID); 
    $(document).on("tap", "#" + APP_UI_FOOT_CONTAINER_ELEMENT_ID, function(){  
        if($("#" + APP_UI_CONTAINER_ELEMENT_ID).hasClass('donation_page')){             
            //send donation
        }
        else{
            drawDonationPage();   
        }
    });
    
    function doOnOrientationChange(){
        switch(window.orientation) {  
            case -90:
            case 90:                
              $("#" + APP_UI_CONTAINER_ELEMENT_ID).addClass('landscape');
              break; 
            default:                
              $("#" + APP_UI_CONTAINER_ELEMENT_ID).removeClass('landscape');
              break; 
        }
    }  
    window.addEventListener('orientationchange', doOnOrientationChange); 
    // Initial execution if needed
    doOnOrientationChange(); 
});    
                   
function resize_appui(){          
    $('#appui').height($('html').outerHeight(true) - $('#appui_head').outerHeight(true) - $('#appui_foot').outerHeight(true));  
}  

/* draw Pages */
function drawEnclosurePage(EnclosureObjArray) {
    var EnclosureObj, EnclosureID;

    EnclosureObj = EnclosureObjArray.data[0];
    EnclosureID = EnclosureObj.EnclosureID;
                                             
    $("#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID).empty();                                                 
    $('#' + APP_UI_HEAD_CONTAINER_ELEMENT_ID).html(EnclosureObj.Name + '<div class="logo"></div>');
    $("#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID).show();  
    $("#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID).removeClass('back');
    
    $("#" + APP_UI_CONTAINER_ELEMENT_ID).empty(); 
    $('<div>').attr({
        id: 'EnclosureHeadDiv',
        class: 'DisplayHead'
    }).appendTo("#" + APP_UI_CONTAINER_ELEMENT_ID);
                            
    $("#EnclosureHeadDiv").html(getEnclosureHeadHTML(EnclosureObj));           

    getAnimalListForEnclosure(EnclosureID);
                                             
    resize_appui();
}

function drawAnimalDetailPage(AnimalObject, AnimalID) {
    var CommonTaxa, GenusTaxa, Age, Weight, Sex, HouseName, Accession, DisplayName, MediaID; 

    MediaID = AnimalObject.data.MediaIdentifierID;
    CommonTaxa = AnimalObject.data.TaxonCommon;
    GenusTaxa = AnimalObject.data.TaxonGenusSS;
    Age = AnimalObject.data.Age;
    Weight = AnimalObject.data.WeightData;
    Sex = AnimalObject.data.SexData;
    HouseName = AnimalObject.data.PrimaryIdentifier;
    Accession = AnimalObject.data.AccessionNumber;

    $("#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID).addClass('back');
    showOrHideAndSaveContent(true);
    
    if(HouseName == null || HouseName == '')
        DisplayName = Accession;
    else
        DisplayName = HouseName;
                                      
    
    $('<div>').attr({
        id: 'AnimalHeadDiv',
        class: 'DisplayHead'
    }).appendTo("#" + APP_UI_CONTAINER_ELEMENT_ID);

    $('<div>').attr({
        id: "ImageDiv",
        class: "ImageThumbDiv"
    }).appendTo("#AnimalHeadDiv");
                                                                             
    $("#ImageDiv").html(getMediaIMGElement(MediaID, DisplayName, 'file'));     

    $('<div>').attr({
        id: "HeadInfoDiv",
        class: "ListingInfo"
    }).appendTo("#AnimalHeadDiv")
    .html('<div class="row">' +
            '<div class="DisplayName">' + DisplayName + '</div>' + 
            '<div class="CommonTaxa">' + CommonTaxa + '</div>' +
        '</div>' + 
        '<div class="row">' + 
            '<div class="GenusTaxa">' + GenusTaxa + '</div>' +  
        '</div>' + 
        '<div class="row">' + 
            '<div class="Sex">' + Sex + '</div>' + 
            '<div class="Age">Age:' + Age + '</div>' +                                   
        '</div>');
    //'<div class="Weight">' + Weight + '</div>'
                         
    $('<div>').attr({
        id: "AnimalActivityDiv",
        class: "AnimalDetail"
    }).appendTo("#" + APP_UI_CONTAINER_ELEMENT_ID)
    .html('<div class="AnimalDetailHead">KEEPER NOTES:</div>');  
    
    getRecentActivityForAnimal(AnimalID);
}

function drawDonationPage(){     
    $("#" + APP_UI_CONTAINER_ELEMENT_ID).addClass('donation_page'); 
    $("#" + APP_UI_FOOT_CONTAINER_ELEMENT_ID).addClass('donation_page'); 
    
    if($("#" + APP_UI_CONTENT_HIDING_PLACE).html() == ''){  
        $("#" + APP_UI_HEAD_CONTAINER_ELEMENT_ID).addClass('back');
        showOrHideAndSaveContent(true);
    }  
    
    $("#" + APP_UI_CONTAINER_ELEMENT_ID).empty(); 
    $('<div>').attr({
        id: 'DonationPage',
        class: 'DisplayHead'
    }).appendTo("#" + APP_UI_CONTAINER_ELEMENT_ID)
    .html('<div class="display"></div><div class="entry"></div>');
                                       
    $('#DonationPage .display').html('<div class="unit">$</div><div class="amount"></div>');  
    $('#DonationPage .entry').html(
        '<div class="row">' +
            '<div class="item"><div class="item_inner">1</div></div>' +
            '<div class="item"><div class="item_inner">2</div></div>' +
            '<div class="item"><div class="item_inner">3</div></div>' +
        '</div>' +
        '<div class="row">' +
            '<div class="item"><div class="item_inner">4</div></div>' +
            '<div class="item"><div class="item_inner">5</div></div>' +
            '<div class="item"><div class="item_inner">6</div></div>' +
        '</div>' +
        '<div class="row">' +
            '<div class="item"><div class="item_inner">7</div></div>' +
            '<div class="item"><div class="item_inner">8</div></div>' +
            '<div class="item"><div class="item_inner">9</div></div>' +
        '</div>' +
        '<div class="row last">' +
            '<div class="item"><div class="item_inner">.</div></div>' +
            '<div class="item"><div class="item_inner">0</div></div>' +
            '<div class="item delete"><div class="item_inner"> </div></div>' +
        '</div>'
    );
    
    $.jStorage.set(DONATION_AMOUNT, '0');
    updateDonation();
    
    
    $('#DonationPage .entry .item').hammer({ dragLockToAxis: true });
    $(document).off("tap", '#DonationPage .entry .item'); 
    $(document).on("tap", '#DonationPage .entry .item', function(){ 
        var amount = $.jStorage.get(DONATION_AMOUNT);
        if($(this).hasClass('delete')){                    
            if(amount.length > 0){                                                        
                amount = amount.substring(0, amount.length - 1);   
            }      
            if(amount == ''){
                amount = '0';
            }     
            $.jStorage.set(DONATION_AMOUNT, amount);                  
        }
        else{                 
            if(amount == '0'){
                amount = '';
            }
            if(amount.indexOf('.') > -1){
                if($(this).find('.item_inner').html() != '.'){  
                    amount = amount + $(this).find('.item_inner').html();
                }
            }
            else{ 
                amount = amount + $(this).find('.item_inner').html();
            }                             
            if(amount == '.'){
                amount = '0.';
            }
            if(amount.indexOf('.') > -1){
                if(amount.indexOf('.') <= amount.length + 3){                           
                    amount = amount.substring(0, amount.indexOf('.') + 3);  
                }
            }
            $.jStorage.set(DONATION_AMOUNT, amount); 
        }
        updateDonation();
    }); 
}

/* login functions */
function validateLogin(userName, password) {
    var URI;

    URI = LOOKUP_ISAPI_URI + LOGIN_POSTFIX + QUESTION + 
          "UserName" + EQUALS + userName + AMPER + 
          "Password" + EQUALS + password;

    getTracksAjax(URI, function(JSONResponseArray) {  
        setLoggedIn(JSONResponseArray);
    }, false);                
}
       
function setLoggedIn(LoginResponse) {
    var SessionID = LoginResponse.data.TracksSessionID;

    $.cookie(SESSION_COOKIE_NAME, SessionID);
    $.jStorage.set(SESSION_COOKIE_NAME, SessionID);

    reset();
}

function checkLoginCookies() {
    var SessionID;

    SessionID = $.cookie(SESSION_COOKIE_NAME);

    if (SessionID == null) {
        $.jStorage.set(SESSION_COOKIE_NAME, NOT_LOGGED_IN);

        return NOT_LOGGED_IN;
    }
    else {
        $.jStorage.set(SESSION_COOKIE_NAME, SessionID);

        return LOGGED_IN;
    }
}

function reset() {
    var LoginThingy = checkLoginCookies();
                          
    if(LoginThingy == NOT_LOGGED_IN)
        validateLogin(VISITOR_USER, VISITOR_PASS);
    else {
        $("#StartButton").attr("disabled", false);
                        
        $('#StartButton').hammer({ dragLockToAxis: true });
        $(document).off("tap", '#StartButton'); 
        $(document).on("tap", '#StartButton', function(){    
            getEnclosureIDFromBeacon($("#BeaconID").val());
        });
    }
}
   
/* helper functions */
function updateDonation(){
    $('#DonationPage .display .amount').html($.jStorage.get(DONATION_AMOUNT));
}

function getAnimalListItemHTML(AnimalObject, DivID) {
    var Html, HouseName, Accession, DisplayName, CommonName, Genus, MediaID;

    Html = '';

    HouseName = AnimalObject.HouseName;
    Accession = AnimalObject.AccessionNumber;
    CommonName = AnimalObject.TaxonCommon;
    Genus = AnimalObject.TaxonGenusSS;
    MediaID = AnimalObject.MediaIdentifierID

    if(HouseName == null || HouseName == '')
        DisplayName = Accession;
    else
        DisplayName = HouseName;

    Html += '<div id="' + DivID + '" class="ListItem">';

    if(MediaID != null && MediaID != '' && !isNaN(MediaID)) {
        Html += '<div class="ImageThumbDiv">' + 
                getMediaIMGElement(MediaID, DisplayName, 'file') +
                '</div>';
    }
    else{   
        Html += '<div class="ImageThumbDiv"></div>';
    }

    Html += '<div class="ListingInfo">';
    Html += '<div class="DisplayName">' + DisplayName + '</div>';
    Html += '<div class="CommonName">' + CommonName + '</div>';
    Html += '<div class="Genus">' + Genus + '</div>';    
    Html += '</div></div>';

    return Html;
}
     
function drawAnimalRecentActivity(AnimalActivityObjArray) {
    var RecordDate, CreateUser, Notes, DivName, MediaMasterID, DivHtml;
                     
    $.each(AnimalActivityObjArray.data, function(idx, AnimalActivityObj) {
        RecordDate = AnimalActivityObj.RecordDate;
        CreateUser = AnimalActivityObj.CreateUser;
        Notes = AnimalActivityObj.Notes;
        MediaMasterID = AnimalActivityObj.MediaMasterID;
                                                 
        DivName = "NoteDiv" + idx;
        DivHtml = '<div class="date">' + RecordDate + '</div>' +
            '<div class="create_user">(' + CreateUser + ')</div>';
        
        if(MediaMasterID == ''){    
            DivHtml = DivHtml + '<div class="notes">' + Notes + '</div>';   
        }
        else{
            DivHtml = DivHtml + '<div class="media">' + getMediaIMGElement(MediaMasterID, '', 'file') + '</div>';             
        }
        
        $('<div>').attr({
            id: DivName,
            class: "AnimalActivity"
        }).appendTo("#AnimalActivityDiv")
        .html(DivHtml);                                               
    });
}

function drawAnimalListingDisplay(AnimalObjectArray) {    
    $("#" + APP_UI_CONTAINER_ELEMENT_ID).append('<div class="ContentContainer"><div class="ContentInner"></div></div>');
    $.each(AnimalObjectArray.data, function(idx, AnimalObj) {
        var AnimalID, DivID;

        AnimalID = AnimalObj.AnimalID;
        DivID = 'Animal' + AnimalID;

        $("#" + APP_UI_CONTAINER_ELEMENT_ID + ' .ContentInner').append(getAnimalListItemHTML(AnimalObj, DivID));
                                                                  
        $('#' + DivID).hammer({ dragLockToAxis: true });
        $(document).off("tap", '#' + DivID); 
        $(document).on("tap", '#' + DivID, function(){       
            getAnimalDetail($(this).attr("id").replace("Animal", ""));
        });    
    });
}

function drawTaxaListingDisplay(TaxaObjectArray) {
    $.each(TaxaObjectArray.data, function(idx, TaxaObject) {
        var TaxID, Common, Scientific, Rank, Range, Endangered, Venomous, DivID;
        
        TaxID = TaxaObject.TaxID;
        Common = TaxaObject.Common;
        Scientific = TaxaObject.Scientific;
        Rank = TaxaObject.Rank;
        Range = TaxaObject.Range;
        Endangered = TaxaObject.Endangered;
        Venomous = TaxaObject.Venomous;
        DivID = "Tax" + TaxID;

        $("#" + APP_UI_CONTAINER_ELEMENT_ID).append('<div id="' + DivID + '">' + 
            Common + ", " + Scientific + ", " + Rank + ", " + Range + ", " + 
            Endangered + ", " + Venomous + 
            '</div>');
        
        $("#" + DivID).data("TaxID", TaxID);
    });
}

function getEnclosureHeadHTML(EnclosureObject) {
    var Html;

    Html = '<div class="EnclosureDesc">' +  EnclosureObject.Description + '</div>' +
           '<div class="Instructions">Tap their photo to meet them</div>';

    return Html;
}

function getAnimalDetail(AnimalID) {
    var URI;

    URI = LOOKUP_ISAPI_URI + ANIMAL_INFO_POSTFIX + SLASH + AnimalID +
          QUESTION + DATATYPE_PAIR_NAME + EQUALS + TAXA_DATATYPE +
          AMPER + sessionIDQuerystringPair();

    getTracksAjax(URI, function(JSONResponseArray) {  
        drawAnimalDetailPage(JSONResponseArray, AnimalID);
    }, false);                
}

function getAnimalListForEnclosure(EnclosureID) {
    var URI;

    URI = LOOKUP_ISAPI_URI + ENCLOSURE_TAXA_LIST_POSTFIX + SLASH + EnclosureID +
          QUESTION + DATATYPE_PAIR_NAME + EQUALS + ANIMALS_DATATYPE +
          AMPER + sessionIDQuerystringPair();

    getTracksAjax(URI, function(JSONResponseArray) {  
        drawAnimalListingDisplay(JSONResponseArray);
    }, false);                
}

function getRecentActivityForAnimal(AnimalID) {
    var URI;

    URI = LOOKUP_ISAPI_URI + ANIMAL_INFO_POSTFIX + SLASH + AnimalID +
          QUESTION + DATATYPE_PAIR_NAME + EQUALS + ACTIVITY_DATATYPE +
          AMPER + sessionIDQuerystringPair();

    getTracksAjax(URI, function(JSONResponseArray) {  
        drawAnimalRecentActivity(JSONResponseArray);
    }, false);                
}

function getMediaIMGElement(MediaFileID, AnimalName, ReturnType) {
    var MediaSrc, TagHTML;
    
    MediaSrc = LOOKUP_ISAPI_URI + MEDIA_POSTFIX + SLASH + MediaFileID + QUESTION + 'ReturnType' + EQUALS + ReturnType + AMPER + sessionIDQuerystringPair();
    TagHTML = '<img class="ImageThumb" src="' + MediaSrc + '"';

    if(AnimalName != null && AnimalName != '')
        TagHTML += ' alt="' + AnimalName + '"';

    TagHTML += '>'

    return TagHTML;
}

function getEnclosureIDFromBeacon(BeaconID) {
    var URI;
    
    URI = LOOKUP_ISAPI_URI + LOOKUP_ENCLOSURE_POSTFIX + QUESTION + 
          ENCLOSURE_IDENTIFIER_TYPE + EQUALS + BEACON_IDENTIFIER_TYPE + AMPER +
          ENCLOSURE_ID + EQUALS + BeaconID + AMPER + sessionIDQuerystringPair();

    getTracksAjax(URI, function(JSONResponseArray) {  
        drawEnclosurePage(JSONResponseArray);
    }, false);                
}

function getTaxaListForEnclosure(EnclosureID) {
    var URI;

    URI = LOOKUP_ISAPI_URI + ENCLOSURE_TAXA_LIST_POSTFIX + SLASH + EnclosureID +
          QUESTION + DATATYPE_PAIR_NAME + EQUALS + TAXA_DATATYPE +
          AMPER + sessionIDQuerystringPair();

    getTracksAjax(URI, function(JSONResponseArray) {  
        drawTaxaListingDisplay(JSONResponseArray);
    }, false);                
}
    
function showOrHideAndSaveContent(HideNow) {
    var TargetDiv, SourceDiv;
    
    if(HideNow) {
        TargetDiv = $("#" + APP_UI_CONTENT_HIDING_PLACE);
        SourceDiv = $("#" + APP_UI_CONTAINER_ELEMENT_ID);
    }
    else {
        SourceDiv = $("#" + APP_UI_CONTENT_HIDING_PLACE);
        TargetDiv = $("#" + APP_UI_CONTAINER_ELEMENT_ID);
    }         
    
    TargetDiv.html(SourceDiv.html());
    SourceDiv.empty();
    
    return TargetDiv.html().length > 0;
}
    
function getTracksAjax(URI, callback, isAsync) {
    var request;
    
    if(isAsync == undefined)
        isAsync = true;

    request = $.ajax({
        type: REQUEST_TYPE_GET,
        async: isAsync,
        url: URI,
        dataType: DATA_TYPE_JSON
    });

    request.success(callback);

    request.error(function(XMLHttpRequest) {
        var JSONResponseArray, ErrorText;
        JSONResponseArray = $.parseJSON(XMLHttpRequest.responseText);

        if(JSONResponseArray != null) {
            if(JSONResponseArray.error.response_code == 'invalid_session'){                      
                $.removeCookie(SESSION_COOKIE_NAME);
                $.jStorage.set(SESSION_COOKIE_NAME, '');
            }
            ErrorText = JSONResponseArray.error.response_code;
            console.log(ErrorText);
        }
    });
}
  
function sessionIDQuerystringPair() {
    return SESSION_ID_NAME + EQUALS + $.jStorage.get(SESSION_COOKIE_NAME) + AMPER + "dt=" + Date.now();
}


/* variables */
var LOOKUP_ISAPI_DLL = 'tracksmobile.dll'
var LOOKUP_ISAPI_URI = 'http://192.168.100.225/tracks/' + LOOKUP_ISAPI_DLL;
var APP_UI_CONTAINER_ELEMENT_ID = 'appui';
var APP_UI_HEAD_CONTAINER_ELEMENT_ID = 'appui_head';
var APP_UI_FOOT_CONTAINER_ELEMENT_ID = 'appui_foot';
var APP_UI_CONTENT_HIDING_PLACE = 'cubby';
var REQUEST_TYPE_GET = 'get';
var REQUEST_TYPE_POST = 'post';
var DATA_TYPE_JSON = 'json'
var SESSION_COOKIE_NAME = 'VisitorSessID';
var SESSION_ID_NAME = 'TracksSessionID';
var NOT_LOGGED_IN = "not-logged-in";
var LOGGED_IN = "logged-in";
var VISITOR_USER = 'demo';
var VISITOR_PASS = 'demo';
var LOGIN_POSTFIX = '/login';
var AMPER = "&";
var EQUALS = "=";
var QUESTION = "?";
var SLASH = "/";
var LOOKUP_ENCLOSURE_POSTFIX = '/visitor-enclosure-lookup';
var ENCLOSURE_TAXA_LIST_POSTFIX = '/visitor-enclosure';
var ANIMAL_INFO_POSTFIX = '/visitor-animal';
var TAXA_INFO_POSTFIX = '/visitor-taxa';
var MEDIA_POSTFIX = '/media';
var ENCLOSURE_IDENTIFIER_TYPE = 'IdentifierType';
var ENCLOSURE_ID = 'IdentifierValue';
var BEACON_IDENTIFIER_TYPE = 'Beacon%20ID';
var DATATYPE_PAIR_NAME = 'datatype';
var TAXA_DATATYPE = 'taxa';
var ANIMALS_DATATYPE = 'animals';
var ACTIVITY_DATATYPE = 'activity';
var DONATION_AMOUNT = 'donation_amount';
