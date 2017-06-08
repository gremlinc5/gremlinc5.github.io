//LMSOFT Web Creator Pro, Version:6.0.25.3
//LMSOFT Kernel 90

if(getURLParam('skipmobiledetection') == 'true') {document.cookie="skipmobiledetection=true";}
var useragent = navigator.userAgent;
useragent = useragent.toLowerCase();
var pos = document.cookie.search("skipmobiledetection=true");
if (pos == -1) {
   if(useragent.indexOf('iphone') != -1 || useragent.indexOf('symbianos') != -1 || useragent.indexOf('ipod') != -1 || useragent.indexOf('android') != -1 || useragent.indexOf('blackberry') != -1 || useragent.indexOf('samsung') != -1 || useragent.indexOf('nokia') != -1 || useragent.indexOf('windows ce') != -1 || useragent.indexOf('sonyericsson') != -1 || useragent.indexOf('webos') != -1 || useragent.indexOf('wap') != -1 || useragent.indexOf('motor') != -1 || useragent.indexOf('symbian') != -1 ) {
      var pathname = document.location.pathname;
      var mobilePagePathname = '/mobile' + pathname;
      $.get(mobilePagePathname, function(){location.pathname=mobilePagePathname;})
      .fail(function(){$.get('/mobile/', function(){location.pathname='/mobile/';})});
   }
}

var projectroot="./";
InitResources2('fr');
var LMObjects = new Array();
var objindex=0;
var fontbase=96.;
//---------------------------------------------------------------------------------------------
try {
if(isValideBrowser(7.00,5.00)) {
//---------------------------------------------------------------------------------------------
LMObjects[objindex++] = LMDiv("Page",1,0,0,null,0,null,null,null,null,0);
defpagewitdh=1024;
LMObjects[objindex++] = LMImage("Img4",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img4=FindTagFromId('Img4');
LMObjects[objindex++] = LMImage("Img2",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img2=FindTagFromId('Img2');
objlist = new Array();
objlist[0] = "Img4";
objlist[1] = "Img2";
LMObjects[objindex++] = LMGroup("Gbackground",1,objlist);
LMObjects[objindex++] = LMDiv("Box1",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMDiv("Box2",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMDiv("Box3",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMImage("Img1",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img1=FindTagFromId('Img1');
LMObjects[objindex++] = LMImage("Img3",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img3=FindTagFromId('Img3');
LMObjects[objindex++] = LMImage("Img10",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img10=FindTagFromId('Img10');
LMObjects[objindex++] = LMImage("Img6",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img6=FindTagFromId('Img6');
objlist = new Array();
objlist[0] = "Box1";
objlist[1] = "Box2";
objlist[2] = "Box3";
objlist[3] = "Img1";
objlist[4] = "Img3";
objlist[5] = "Img10";
objlist[6] = "Img6";
LMObjects[objindex++] = LMGroup("Gcenter",1,objlist);
LMObjects[objindex++] = LMDiv("Box5",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMDiv("Box6",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMDiv("Box7",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMImage("Img7",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img7=FindTagFromId('Img7');
branchlist = new Array();
LMObjects[objindex++] = LMText("Text13",1,1,0,null,0,null,branchlist,null,null);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text14",1,1,0,null,0,null,branchlist,null,null);
LMObjects[objindex++] = LMImage("Img8",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img8=FindTagFromId('Img8');
branchlist = new Array();
LMObjects[objindex++] = LMText("Text1",1,1,0,null,0,null,branchlist,null,null);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text2",1,1,0,null,0,null,branchlist,null,null);
LMObjects[objindex++] = LMImage("Img9",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img9=FindTagFromId('Img9');
branchlist = new Array();
LMObjects[objindex++] = LMText("Text8",1,1,0,null,0,null,branchlist,null,null);
objlist = new Array();
objlist[0] = "Box5";
objlist[1] = "Box6";
objlist[2] = "Box7";
objlist[3] = "Img7";
objlist[4] = "Text13";
objlist[5] = "Text14";
objlist[6] = "Img8";
objlist[7] = "Text1";
objlist[8] = "Text2";
objlist[9] = "Img9";
objlist[10] = "Text8";
LMObjects[objindex++] = LMGroup("GWelcome",1,objlist);
objlist = new Array();
LMObjects[objindex++] = LMGroup("GCompany",1,objlist);
LMObjects[objindex++] = LMDiv("Box8",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMDiv("Box9",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMDiv("Box10",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMImage("Img11",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img11=FindTagFromId('Img11');
branchlist = new Array();
LMObjects[objindex++] = LMText("Text7",1,1,0,null,0,null,branchlist,null,null);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text5",1,1,0,null,0,null,branchlist,null,null);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text6",1,1,0,null,0,null,branchlist,null,null);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text3",1,1,0,null,0,null,branchlist,null,null);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text4",1,1,0,null,0,null,branchlist,null,null);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text9",1,1,0,null,0,null,branchlist,null,null);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text10",1,1,0,null,0,null,branchlist,null,null);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text11",1,1,0,null,0,null,branchlist,null,null);
objlist = new Array();
objlist[0] = "Box8";
objlist[1] = "Box9";
objlist[2] = "Box10";
objlist[3] = "Img11";
objlist[4] = "Text7";
objlist[5] = "Text5";
objlist[6] = "Text6";
objlist[7] = "Text3";
objlist[8] = "Text4";
objlist[9] = "Text9";
objlist[10] = "Text10";
objlist[11] = "Text11";
LMObjects[objindex++] = LMGroup("G_News",1,objlist);
LMObjects[objindex++] = LMDiv("Box14",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMDiv("Box15",1,1,0,null,0,null,null,null,null,0);
menusystemmodel005Show("Menu1");
objlist = new Array();
objlist[0] = "Box14";
objlist[1] = "Box15";
objlist[2] = "Menu1";
LMObjects[objindex++] = LMGroup("Gmenu",1,objlist);
LMObjects[objindex++] = LMDiv("Box4",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMImage("Img12",1,1,0,null,0,null,null,null,null,0);
if(is.ns) Img12=FindTagFromId('Img12');
LMObjects[objindex++] = LMDiv("Box11",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMDiv("Box12",1,1,0,null,0,null,null,null,null,0);
LMObjects[objindex++] = LMDiv("Box13",1,1,0,null,0,null,null,null,null,0);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text12",1,1,0,null,0,null,branchlist,null,null);
objlist = new Array();
objlist[0] = "Box4";
objlist[1] = "Img12";
objlist[2] = "Box11";
objlist[3] = "Box12";
objlist[4] = "Box13";
objlist[5] = "Text12";
LMObjects[objindex++] = LMGroup("Gbanner",1,objlist);
LMObjects[objindex++] = LMImage("Img14",1,1,0,null,0,null,new LMBranchEx("0","http://www.lmsoft.com/PowerByLMSOFTEN",null,0.0,null,null,1,1,1,1,1,1,0,640,480,"_self"),null,null,1);
if(is.ns) Img14=FindTagFromId('Img14');
objlist = new Array();
objlist[0] = "Img14";
LMObjects[objindex++] = LMGroup("Gbottom",1,objlist);
branchlist = new Array();
LMObjects[objindex++] = LMText("Text16",1,1,0,null,0,null,branchlist,null,null);
objlist = new Array();
objlist[0] = "Text16";
LMObjects[objindex++] = LMGroup("Gtop",1,objlist);
//---------------------------------------------------------------------------------------------
}
}catch(e) {
alert(e.message);
}
SetBaseColor(0x3f0,0x3f8,0x73);
LMObjectAnimate();

