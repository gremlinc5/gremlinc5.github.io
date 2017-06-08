//Copyright LMSOFT 1999 - 2012

var pub_home = "./index.html";

var z_index=0;
var currentIdIn=-1;
var gMaxVisibleItems=0;

function AddAnchorTagToObject(id)
{
	var tagdiv=document.getElementById(id);
	if(tagdiv.parentNode.tagName=="A") {
		if(tagdiv.parentNode.name != "ANCHOR_"+id) {
			tagdiv.parentNode.name="ANCHOR_"+id;
		}
	}
	else {
		var newElement= $("<A name=\"ANCHOR_"+id+"\"/>");

		var parent= tagdiv.parentNode;
		for (i= 0; i < parent.children.length; i++) {
			if (parent.children[i].id == id) {
				parent.insertBefore(newElement[0],parent.children[i]);
				break;
			}
		}
   }
}

function LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,BranchLst,tooltip,param,addlink)
{
   addlink= false;
   if(addlink==true) {
	   AddAnchorTagToObject(id);
   } 

   var tagdiv=document.getElementById(id);
   tagdiv.drawok=0;
   tagdiv.drawingeffect=0; 
   if(tooltip) tagdiv.title=tooltip;
   
   z_index++;
   this.id = id;
   this.object=null;
   this.LTO=new Array;
   this.InitObject=null;
   this.ResizeObject=null; 
   this.OnAfterPageDisplay=null;
   this.ShowObject=null; 
   this.HideObject=null;
   this.Play=null;
   this.Stop=null;
   this.RollIn=null;
   this.RollOut=null;
   this.IsMovable=true;
   this.visible=initvisible;
   this.displayenable=displayenable;

   this.x = tagdiv.offsetLeft;
   this.y = tagdiv.offsetTop;
   this.w = tagdiv.offsetWidth;
   this.h = tagdiv.offsetHeight;
   this.orix = this.x;
   this.oriy = this.y;
   this.oriw = this.w;
   this.orih = this.h;
   this.initvisible=initvisible;
   
   this.param = param;
   this.BranchLst = BranchLst;

   if (delais == null) {
      this.delais = 0;
   } else {
      this.delais = delais;
   }

   if (delaisdisp == null) {
      this.delaisdisp = 0;
   } else {
      this.delaisdisp = delaisdisp;
   }
   
   if (effect == null) {
      this.Effect = LMEffectShow;
   } else {
      this.Effect = effect;
   }

   if (effectdisp == null) {
      this.EffectDisp = LMEffectHide;
   } else {
      this.EffectDisp = effectdisp;
   }
   this.EffectDisp = LMEffectHide;
   this.EffectFinishEvent=null;
   
   this.TagObject=tagdiv; 
   tagdiv.LMObjectsIdx=FindIdxInLMObjects(id); 

   tagdiv.GetTop=TagGetTop;
   tagdiv.SetTop=TagSetTop; 
   tagdiv.GetLeft=TagGetLeft;
   tagdiv.SetLeft=TagSetLeft; 
   tagdiv.GetWidth=TagGetWidth;
   tagdiv.SetWidth=TagSetWidth;
   tagdiv.GetHeight=TagGetHeight;
   tagdiv.SetHeight=TagSetHeight;
   tagdiv.SetClip=TagSetClip;
   
   //Methods
   tagdiv.SetX=LMObjectMethodSetX;
   tagdiv.GetX=LMObjectMethodGetX;
   tagdiv.SetY=LMObjectMethodSetY;
   tagdiv.GetY=LMObjectMethodGetY;
   tagdiv.SetW=LMObjectMethodSetW;
   tagdiv.GetW=LMObjectMethodGetH;
   tagdiv.SetH=LMObjectMethodSetH;
   tagdiv.GetH=LMObjectMethodGetH;
   tagdiv.SetXYWH=LMObjectMethodSetXYWH;
   tagdiv.IsVisible=TagIsVisible;
   tagdiv.Show=TagShow;
   tagdiv.Hide=TagHide;
   tagdiv.ShowEffect=TagShowEffect;
   tagdiv.HideEffect=TagHideEffect;
   tagdiv.ToggleVisibleState=TagToggleVisibleState;
   tagdiv.IsDrawingEffect=TagIsDrawingEffect;
   tagdiv.RollIn=TagRollIn;
   tagdiv.RollOut=TagRollOut;
   if(initvisible==false) tagdiv.Hide();
   
   return this;
}

function FireEvent(id,event)
{
   var strvar="window."+id+event;
   var strcnd="if("+strvar+") "+ strvar + "()";
   eval(strcnd);
}

function LMObjectClick(id,idxbr)
{
   var LMObject=FindClassObjectFromId(id);
   if (LMObject && LMObject.BranchLst && LMObject.BranchLst[idxbr]) {
      var DoBranch = true;
      if(LMObject.BranchLst[idxbr].code) {
         DoBranch = LMObject.BranchLst[idxbr].code(LMObject.BranchLst[idxbr],id,LMObject,LMObject);
      }
      if(DoBranch) LMObjectBranch(LMObject.BranchLst[idxbr]);
   }
}

function LMObjectBranch(branch)
{
   if(branch == null) return;
   if(branch.where == null) return;
   if(branch.where == "") return;

   switch (branch.where) {
      case "GADGET: 1": // home
         location = pub_home;
         break;
      case "GADGET: 2": // back
         history.back();
         break;
      case "GADGET: 3": // quit without confirm
         parent.window.close();
         break;
      case "GADGET: 4": // signet
         break;
      case "GADGET: 5": // quit with confirm
         var ok = confirm(MSG_QUIT); //quit with confirm
         if (ok) parent.window.close();
         break;
      case "GADGET: 6": // next 
         history.forward();
         break;
      case "GADGET: 7": // print
         window.print();
         break;
      case "GADGET: 8": // event next
         break;
      case "GADGET: 9": // event previous
         break;
      case "GADGET: 10": // Add to favorites
         if(is.ie) window.external.AddFavorite(location.href, document.title);
         else if (is.ns) alert(RES_ADDFAVORITES);
         break;
      case "GADGET: 11": // Send to a friend
         window.location="mailto:?subject="+document.title+"&body="+location.href; 
         break;
   default:
         if(branch.openinnewwindow) {
            var param="";
            param+="status="+branch.status+",";
            param+="menubar="+branch.menubar+",";
            param+="toolbar="+branch.toolbar+",";
            param+="location="+branch.toolbar+",";
            param+="scrollbars="+branch.scrollbar+",";
            param+="resizable="+branch.resizeenable+",";
            if(branch.setdefaultwh) {
               param+="width="+branch.width+","; 
               param+="height="+branch.height+","; 
            }
            window.open(branch.where,branch.windowname,param);
         } 
         else {
            if(branch.where.substring(0,5).toLowerCase()=="http:") {
               window.location = branch.where;
            }
            else if(branch.where.substring(0,6).toLowerCase()=="https:") {
               window.location = branch.where;
            }
            else if(branch.where.substring(0,4).toLowerCase()=="ftp:") {
               window.location = branch.where;
            }
            else window.location = branch.where; 
         }
         break;
   }
}

function LMGlobalUp(e)
{
   if(e==null) var e=window.event;
   e.cancelBubble = true;

   if(currentIdIn==-1) return;

   var obj=FindClassObjectFromId(currentIdIn);
   if(!obj) return;

   var id=currentIdIn;
   FireEvent(id,"_OnMouseUp"); 
   FireEvent(id,"_OnClick"); 

   if(obj.MouseUp) obj.MouseUp();
}

function LMGlobalDn(e) 
{
   if(e==null) var e=window.event;
   e.cancelBubble = true;

   if(currentIdIn==-1) return;

   var obj=FindClassObjectFromId(currentIdIn);
   if(!obj) return;

   FireEvent(currentIdIn,"_OnMouseDown"); 

   if(obj.MouseDn) obj.MouseDn();
}

var infct=false;
function LMGlobalOver(id)
{
   if(infct) return;
   infct=true;

   if(currentIdIn==id) {
      infct=false;
      return; }
   LMGlobalOut();
   if(id<=-1) {
      infct=false;
      return; }

   currentIdIn=id;

   var obj=FindClassObjectFromId(currentIdIn);
   if(!obj) {
      infct=false;
      return; }

   if(currentIdIn!=-1) {
      FireEvent(currentIdIn,"_OnMouseEnter");
   }

   if(obj.MouseOver) obj.MouseOver();

   infct=false;
}

function LMGlobalOut()
{
   if(currentIdIn<=-1) return;
   var id=currentIdIn;

   var obj=FindClassObjectFromId(id);
   if(!obj) return;

   if(currentIdIn!=-1) {
      FireEvent(currentIdIn,"_OnMouseLeave");
   }
   currentIdIn=-1;

   if(obj.MouseOut) obj.MouseOut();
}

function LMObjectMethodSetX(x)
{
   obj=FindClassObjectFromTagDiv(this);
   if(!obj) return;
   this.SetXYWH(x,obj.oriy,obj.oriw,obj.orih);
}

function LMObjectMethodGetX()
{
   obj=FindClassObjectFromTagDiv(this);
   if(!obj) return 0;
   return obj.orix;
}

function LMObjectMethodSetY(y)
{
   obj=FindClassObjectFromTagDiv(this);
   if(!obj) return;
   this.SetXYWH(obj.orix,y,obj.oriw,obj.orih);
}

function LMObjectMethodGetY()
{
   obj=FindClassObjectFromTagDiv(this);
   if(!obj) return 0;
   return obj.oriy;
}

function LMObjectMethodSetW(w)
{
   obj=FindClassObjectFromTagDiv(this);
   if(!obj) return;
   this.SetXYWH(obj.orix,obj.oriy,w,obj.orih);
}

function LMObjectMethodGetW()
{
   obj=FindClassObjectFromTagDiv(this);
   if(!obj) return 0;
   return obj.oriw;
}

function LMObjectMethodSetH(h)
{
   obj=FindClassObjectFromTagDiv(this);
   if(!obj) return;
   this.SetXYWH(obj.orix,obj.oriy,obj.oriw,h);
}

function LMObjectMethodGetH()
{
   obj=FindClassObjectFromTagDiv(this);
   if(!obj) return 0;
   return obj.orih;
}

function LMObjectMethodSetXYWH(x,y,w,h)
{
   var LMObject=FindClassObjectFromId(this.id);
   LMObject.orix=x;
   LMObject.oriy=y;
   LMObject.oriw=w;
   LMObject.orih=h;

   wori=this.GetWidth(); 
   hori=this.GetHeight(); 

   newx=(x*GPropW)+GOffetX;
   LMObject.x=newx;
   LMObject.TagObject.SetLeft(newx);

   newy=(y*GPropH)+GOffetY;
   LMObject.y=newy;
   LMObject.TagObject.SetTop(newy);

   neww=w*GPropW;
   newh=h*GPropH;

   this.SetWidth(neww);
   this.SetHeight(newh);
   if(LMObject.ResizeObject) LMObject.ResizeObject(neww/wori,newh/hori); 
   this.SetClip(0,this.GetWidth(),this.GetHeight(),0)
}

init=false;
function AdjustHeight()
{
   return;
   if(init==false) {
      for(var i=0; i<LMObjects.length; i++) {
         LMObjects[i].orih=1.1*LMObjects[i].orih;
         LMObjects[i].TagObject.SetHeight(LMObjects[i].orih);
         LMObjects[i].TagObject.SetClip(0,LMObjects[i].TagObject.GetWidth(),LMObjects[i].orih,0);
      }
      init=true;
   }
}

function LMObjectDelaiHide(LMObjects,idx)
{
   if(LMObjects[idx].TagObject.drawingeffect==1) {
      setTimeout("LMObjectDelaiHide(LMObjects," + idx + ")",10);
      return;
   }
   LMGlobalOver(-1);
   LMObjects[idx].EffectDisp();
}

function LMObjectAnimateElem(LMObjects,currentidx)
{
var v=0;

   if(currentidx>=gMaxVisibleItems) return;

   if(LMObjects[currentidx].InitObject) LMObjects[currentidx].InitObject();

   //Init all object that have the same delai and have no effect
   for(v=currentidx+1; v<gMaxVisibleItems; v++) {
      if(LMObjects[currentidx].delais!=LMObjects[v].delais || LMObjects[v].Effect!=LMEffectShow) break;
      if(LMObjects[v].InitObject) LMObjects[v].InitObject();
   }

   if(LMObjects[currentidx].TagObject.drawok==0) {
      setTimeout("LMObjectAnimateElem(LMObjects," + currentidx + ")",10);
      return;
   }

   //Must be at the same value for drawingeffect
   //If one of then are not equal then we will wait
   if(LMObjects[currentidx].TagObject.drawingeffect==0) {
      for(v=currentidx; v<gMaxVisibleItems; v++) {
         if(LMObjects[currentidx].delais!=LMObjects[v].delais || LMObjects[v].TagObject.drawok==0 || LMObjects[v].Effect!=LMEffectShow) break;
      }
   }
   else {
      for(v=currentidx; v<gMaxVisibleItems; v++) {
         if(LMObjects[currentidx].delais!=LMObjects[v].delais) break;
         if(LMObjects[v].Effect!=LMEffectShow) break;
         if(LMObjects[v].TagObject.drawingeffect==0) break;
         if(LMObjects[currentidx].TagObject.drawingeffect!=LMObjects[v].TagObject.drawingeffect) {
            setTimeout("LMObjectAnimateElem(LMObjects," + currentidx + ")",10);
            return;
         }
      }
   }
   if(v==currentidx) v++;
   var valend=v;

   drawingeffect=LMObjects[currentidx].TagObject.drawingeffect;

   if(v+1<gMaxVisibleItems) {
      if(LMObjects[v+1].InitObject) LMObjects[v+1].InitObject(LMObjects[v+1]);
   }

   if(drawingeffect==0) { //Show all the objects ready of the same delai  
      for(var v=currentidx; v<valend; v++) {
         LMObjects[v].Effect();
      }
      setTimeout("LMObjectAnimateElem(LMObjects," + currentidx + ")",10);
   }
   else if(drawingeffect==1) { //Wait all objects ready of the same delai to finish drawing
      setTimeout("LMObjectAnimateElem(LMObjects," + currentidx + ")",10);
      return;
   }
   else if(drawingeffect==2) {
      var delai=LMObjects[currentidx].delaisdisp-LMObjects[currentidx].delais;
      if(delai>0 || (LMObjects[currentidx].delais>0 && delai==0)) {
         setTimeout("LMObjectDelaiHide(LMObjects," + currentidx + ")",delai);
      }

      currentidx=valend;

      if(currentidx<gMaxVisibleItems) {
         var offset=0;
         if(currentidx>0) offset=LMObjects[currentidx-1].delais;
         setTimeout("LMObjectAnimateElem(LMObjects," + currentidx + ")",(LMObjects[currentidx].delais-offset));
      }
      else {
         for(var i=0; i<LMObjects.length; i++) {
            if(LMObjects[i].OnAfterPageDisplay) LMObjects[i].OnAfterPageDisplay();
         }
         AdjustHeight();
      }
   }
   else  {
      //alert("bug LMObjectAnimateElem");
      //alert(LMObjects[i].TagObject.drawingeffect);
   }
}

function LMObjectAnimate()
{
   if(LMObjects.length<=0) return;

   //LMGlobalPosPage();

   //Split
   var i=0;
   var countvisible=0;
   var countnotvisible=0;
   var LMObjectsVisible = new Array();
   var LMObjectsNotVisible = new Array();

   for(i=0; i<LMObjects.length; i++) {
      if(LMObjects[i].initvisible==true) {
         LMObjectsVisible[countvisible]=LMObjects[i]; 
         LMObjectsVisible[countvisible].TagObject.LMObjectsIdx=countvisible;
         countvisible++;
      }
      else {
         LMObjectsNotVisible[countnotvisible]=LMObjects[i]; 
         LMObjectsNotVisible[countnotvisible].TagObject.LMObjectsIdx=countvisible;
         countnotvisible++;
      }
   }
   gMaxVisibleItems=countvisible;
   LMObjects=LMObjectsVisible;

   LMObjectSort(LMObjects,0,LMObjects.length-1);

   //Concatain
   var i,j;
   var start=LMObjects.length;
   for(i=0,j=LMObjects.length; i<countnotvisible; i++,j++) {
      LMObjects[j]=LMObjectsNotVisible[i];
      LMObjects[j].TagObject.LMObjectsIdx=j;
   }

   //Initialise new object
   for(i=start; i<LMObjects.length; i++) {
      if(LMObjects[i].InitObject) LMObjects[i].InitObject();
      LMObjects[i].TagObject.drawingeffect=2;
      LMObjects[i].delais=0;
   }

   setTimeout("LMObjectAnimateElem(LMObjects,0)",LMObjects[0].delais);
}

function LMObjectSort(LMObjects,first,last)
{
var a,b,left,right;
var left_ref,right_ref,x;

   if (first==last) return;

   middle = parseInt((first+last)/2);
   if(isNaN(middle)) middle=0;

	do {
		left_ref=LMObjects[first].delais;
     	left=first;
		for(var a=first; a<=middle; a++) {
   		x=LMObjects[a].delais;
       	if (x > left_ref) {
       		left=a; 
            left_ref=x;
       	}
		}       

		right_ref=LMObjects[middle+1].delais;
      right=middle+1;
     	for(var b=middle+1; b<=last; b++) {
         x=LMObjects[b].delais;
       	if(x < right_ref) {
            right_ref=x;
         	right=b; 
         }
		}         

     	if(left_ref > right_ref) {
      	object=LMObjects[left];
         LMObjects[left]=LMObjects[right];
         LMObjects[right]=object;
         LMObjects[left].TagObject.LMObjectsIdx=left;
         LMObjects[right].TagObject.LMObjectsIdx=right;
		}  
             
   }while(left_ref > right_ref);

   LMObjectSort(LMObjects,first,middle);
   LMObjectSort(LMObjects,middle+1,last);
}

function LMBranch(id,where)
{
   this.id    = eval(id);
   this.where = where;

   this.sound = null;
   this.code  = null;
   this.param = null;
   this.delais = 0,0;

   this.openinnewwindow = 0;
   this.status = 0;
   this.menubar = 0;
   this.toolbar = 0;
   this.scrollbar = 0;
   this.resizeenable = 0;
   this.setdefaultwh = 0;
   this.width = 0;
   this.height = 0;
   this.windowname = "";
}

function LMBranchEx(id,where,sound,delais,code,param,openinnewwindow,status,menubar,
                  toolbar,scrollbar,resizeenable,setdefaultwh,width,height,windowname)
{
   this.id    = eval(id);
   this.where = where;
   this.sound = sound;
   this.code  = code;
   this.param = param;
   this.delais = delais;

   this.openinnewwindow = openinnewwindow;
   this.status = status;
   this.menubar = menubar;
   this.toolbar = toolbar;
   this.scrollbar = scrollbar;
   this.resizeenable = resizeenable;
   this.setdefaultwh = setdefaultwh;
   this.width = width;
   this.height = height;
   this.windowname = windowname;
}

function GadgetShowLink(branch)
{
   if(branch == null) return;
   if(branch.where == null) return;
   if(branch.where == "") return;

   switch (branch.where) {
      case "GADGET: 1": // home
         window.status=RES_GADGETHOME; 
         break;
      case "GADGET: 2": // back
         window.status=RES_GADGETBACK; 
         break;
      case "GADGET: 3": // quit without confirm
         window.status=RES_GADGETQUIT; 
         break;
      case "GADGET: 4": // signet
         break;
      case "GADGET: 5": // quit with confirm
         window.status=RES_GADGETQUIT; 
         break;
      case "GADGET: 6": // next 
         window.status=RES_GADGETFOWARD; 
         break;
      case "GADGET: 7": // print
         window.status=RES_GADGETPRINT; 
         break;
      case "GADGET: 8": // event next
         break;
      case "GADGET: 9": // event previous
         break;
      case "GADGET: 10": // Add to favorites
         window.status=RES_GADGETADDFAVORITE; 
         break;
      case "GADGET: 11": // Send to a friend
         window.status=RES_GADGETSENDTOFRIEND; 
         break;
   }
}function LMButton(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branchdn,branchup,tooltip,param,is2state,initpress,cursor)
{
   var tmp = " ";
   var BranchLst = null;

   if(branchup || branchdn) {
      BranchLst = new Array();
      BranchLst[0] = branchdn;
      BranchLst[1] = branchup;
   }

   var LMButton = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,BranchLst,tooltip,param,true);

   var tagdiv=document.getElementById(id);

   if(tooltip) tagdiv.text=tooltip;

   tagdiv.SetWidth=TagSetWidth;
   tagdiv.SetHeight=TagSetHeight;
   tagdiv.onmouseover=TagLMButtonMouseOver;
   tagdiv.onmouseout=TagLMButtonMouseOut;
   tagdiv.onmouseup=LMGlobalUp;
   tagdiv.onmousedown=LMGlobalDn;
   
   LMButton.MouseUp=LMButtonMouseUp;
   LMButton.MouseDn=LMButtonMouseDn;
   LMButton.MouseOver=LMButtonMouseOver;
   LMButton.MouseOut=LMButtonMouseOut;
   LMButton.InitObject=LMButtonInit;
   LMButton.ButtonOver = false;
   LMButton.init=false;

   LMButton.cursor=cursor;
   if(is2state==0) initpress=0;
   LMButton.is2state=is2state;
   LMButton.pressstate=initpress;

   LMButton.TagDiv=tagdiv;

   LMButton.TagObject.IsPress=TagLMButtonIsPress;
   LMButton.TagObject.Press=TagLMButtonSetPressState;

   return LMButton;
}

function LMButtonInit()
{
   if(this.init==true) return;
   this.init=true;

   tagdiv=document.getElementById(this.id);
   if(this.is2state && this.pressstate) {
	  SetStateUp(this.id);
	  tagdiv.className="Down";
      tagdiv.drawok=1;
   }
   else {
	  SetStateUp(this.id);
	  tagdiv.className="Up";
      tagdiv.drawok=1;
   }
}

function SetState(id,state,text)
{
	var tagdiv=document.getElementById(id);
	if(!tagdiv) return;
	tagdiv.className=state;

	if(text==null) return;

	var object=FindClassObjectFromId(id);
	if(!object) return;

	var tagp=$("#" + id + " p");
	if(tagp.html()==null) return;
	tagp.html(text);
}

function SetStateUp(id)
{
	var object=FindClassObjectFromId(id);
	if(!object) return;

	var tagtxt=$("#l" + id + "Up");
	SetState(id,"Up",tagtxt.html());
}

function SetStateDown(id)
{
	var object=FindClassObjectFromId(id);
	if(!object) return;

	var tagtxt=$("#l" + id + "Down");
	if(tagtxt.html()==null) {
		tagtxt=$("#l" + id + "Over");
		if(tagtxt.html()==null) {
			tagtxt=$("#l" + id + "Up");
		}
	}
	SetState(id,"Down",tagtxt.html());
}

function SetStateOver(id)
{
	var object=FindClassObjectFromId(id);
	if(!object) return;

	var tagtxt=$("#l" + id + "Over");
	if(tagtxt.html()==null) {
		tagtxt=$("#l" + id + "Up");
	}
	SetState(id,"Over",tagtxt.html());
}

function TagLMButtonMouseOver(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(this.id); 
}

function TagLMButtonMouseOut(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(-1);  
}

function LMButtonMouseUp()
{
   if(this.is2state) {
      if(this.pressstate) {
         FireEvent(this.id,"_WhenButtonDown");
         LMObjectClick(this.id,0);
      }
      else {
         FireEvent(this.id,"_WhenButtonUp");
         LMObjectClick(this.id,1); 
      }
   }
   else {
      if (!this.ButtonOver) {
		 SetStateUp(this.id);
      } 
      else {
		 SetStateOver(this.id);
      }

      FireEvent(this.id,"_WhenButtonUp");

      LMObjectClick(this.id,0); 
   }
}

function LMButtonMouseDn()
{
   if(this.is2state) {
      if(this.pressstate) {
		 SetStateUp(this.id);
      }
      else {
		 SetStateDown(this.id);
      }
      if(this.pressstate) this.pressstate=0;
      else this.pressstate=1; 
   }
   else {
	  SetStateDown(this.id);
      FireEvent(this.id,"_WhenButtonDown");
   }
}

function LMButtonMouseOver()
{
   this.ButtonOver = true;

   SetStateOver(this.id);

   if(this.cursor) this.TagDiv.style.cursor = "pointer";
   if(this.BranchLst) GadgetShowLink(this.BranchLst[this.pressstate]);
}

function LMButtonMouseOut()
{
   this.ButtonOver = false;

   if(this.is2state) {
      if(this.pressstate) {
		  SetStateDown(this.id);
      }
      else {
		  SetStateUp(this.id);
      }
   }
   else {
	   SetStateUp(this.id);
   }

   if(this.BranchLst) window.status="";
}

function TagLMButtonIsPress()
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return false;
   return object.pressstate;
}

function TagLMButtonSetPressState(state)
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return;

   if(object.is2state==false) return;

   object.pressstate=state;
   if(object.pressstate) {
	  SetStateDown(this.id);
      FireEvent(this.id,"_WhenButtonDown");
   }
   else {
	  SetStateUp(this.id);
      FireEvent(this.id,"_WhenButtonUp");
   }
}


function getCookie(name) {
	var key = name + "=";
	var cookies = document.cookie;
	var keyPosition = cookies.indexOf(key);
		
	if (keyPosition == -1) return null;
		
	var valuePosition = keyPosition + key.length;
	var valuePositionEnd = cookies.indexOf(";", valuePosition);
		
	if (valuePositionEnd == -1) valuePositionEnd = cookies.length;
		
	return unescape(cookies.substring(valuePosition, valuePositionEnd));
}

function setCookie(name, value, path, timeseesion) {
    var cookie = name + "=" + value;
	 var exp = new Date();
    
	 //patch pour netscape 4.x.
    if(is.ns && is.major<5 && exp.getYear()<1900) exp.setYear(exp.getYear() + 1900); 
	
	 //le cookie expire dans timeseesion.
	 exp.setTime(exp.getTime() + timeseesion);
	 cookie = cookie + "; expires=" + exp.toGMTString();

    if(path!=null) cookie = cookie + "; path=" + path;

    //assignation du cookie
    document.cookie = cookie;
}


function DoorOpenHCallBack(isend,TagObject,lefty,righty)
{
   TagObject.SetClip(lefty,TagObject.GetWidth(),righty,0);
}

function DoorOpenH()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var y=this.TagObject.GetTop();
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();

   var my=h/2.;
   var lefty=my;
   var righty=my;

   this.TagObject.SetClip(my,w,my,0);

   var delta=8;
   var dep=0.;

   for(var i=0; i<(h-1)/2+1; i+=delta) { 
      lefty=my-dep;
      if(lefty<0) lefty=0;
      righty=my+dep;
      if(righty>h) righty=h;

      dep+=delta;

      setTimeout("DoorOpenHCallBack(false, FindTagFromId(\"" + this.id + "\")," + lefty + "," + righty + ")",timeslide); 
      timeslide+=25.;
   }
   setTimeout("DoorOpenHCallBack(true, FindTagFromId(\"" + this.id + "\")," + 0 + "," + h + ")",timeslide);
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}


function DoorOpenWCallBack(isend,TagObject,leftx,rightx)
{
   TagObject.SetClip(0,rightx,TagObject.GetHeight(),leftx);
}

function DoorOpenW()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var x=this.TagObject.GetTop();
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();

   var mx=w/2.;
   var leftx=mx;
   var rightx=mx;

   this.TagObject.SetClip(0,mx,h,mx);

   var delta=8;
   var dep=0.;

   for(var i=0; i<(w-1)/2+1; i+=delta) { 
      leftx=mx-dep;
      if(leftx<0) leftx=0;
      rightx=mx+dep;
      if(rightx>w) rightx=w;

      dep+=delta;

      setTimeout("DoorOpenWCallBack(false, FindTagFromId(\"" + this.id + "\")," + leftx + "," + rightx + ")",timeslide); 
      timeslide+=25.;
   }
   setTimeout("DoorOpenWCallBack(true, FindTagFromId(\"" + this.id + "\")," + 0 + "," + w + ")",timeslide);
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}


function EffectBottomUpCallBack(isend,TagObject,valy,valh)
{
   if(isend) {
      TagObject.SetTop(valy);
      TagObject.SetClip(0,TagObject.GetWidth(),valh,0);
   }
   else {
      TagObject.SetTop(TagObject.GetTop()-5);
      if(TagObject.GetTop()<valy) TagObject.SetTop(valy); 
      var offsetclip = valy+valh-TagObject.GetTop();
      TagObject.SetClip(0,TagObject.GetWidth(),offsetclip,0);
   }
}

function EffectBottomUp()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var y=this.TagObject.GetTop();
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();

   this.TagObject.SetTop(y+h);
   var val=y+h-this.TagObject.GetTop();
   this.TagObject.SetClip(0,w,val,0); 

   for(var i=0; i<h-1; i+=5) { 
      setTimeout("EffectBottomUpCallBack(false, FindTagFromId(\"" + this.id + "\")," + y + "," + h + ")",timeslide); 
      timeslide+=25.;
   }
   setTimeout("EffectBottomUpCallBack(true, FindTagFromId(\"" + this.id + "\")," + y + "," + h + ")",timeslide);
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}


function EffectCrossH()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectCrossV()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectDemiCercle()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectDissolve()
{
   if (is.ns) {
      this.Effect = LMEffectShow; 
      this.Effect();
   }
   else if(is.ie) {
      if(is.minor>=5.5) {
         this.TagObject.style.filter="progid:DXImageTransform.Microsoft.RandomDissolve(duration=1.0)";
         EffetTryCatch(this,1000);
      }
      else {
         this.TagObject.style.filter="revealTrans(duration=1.0,transition=12)";
         if(this.TagObject.filters && this.TagObject.filters[0]) {
            this.TagObject.filters[0].Apply();
            this.TagObject.Show();
            this.TagObject.drawingeffect=1;
            this.TagObject.filters[0].Play();
            setTimeout("SetDrawingEffect(" + this.id + ",2)",1000);
         }
         else {
            this.Effect = LMEffectShow; 
            this.Effect();
         }
      }
   }
}


function EffectExplodeCallBack(isend,TagObject,leftx,rightx,upy,downy)
{
   TagObject.SetClip(upy,rightx,downy,leftx);
}

function EffectExplode()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var x=this.TagObject.GetLeft();
   var y=this.TagObject.GetTop();
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();

   var mx=w/2.;
   var my=h/2.;
   this.TagObject.SetClip(my,mx,my,mx);

   var prop=h/w;

   var delta=8;
   var dep=0.;
   var prop2=delta*prop;

   for(var i=0; i<(w-1)/2+1; i+=delta) { 
      var rightx=mx+i;
      if(rightx>w) rightx=w-1;
      var leftx=mx-i;
      if(leftx<0) leftx=0;
      var upy=my-dep;
      if(upy<0) upy=0;
      var downy=my+dep;
      if(downy>h) downy=h-1;
      dep+=prop2;
      setTimeout("EffectExplodeCallBack(false, FindTagFromId(\"" + this.id + "\")," + leftx + "," + rightx + "," + upy + "," + downy + ")",timeslide); 
      timeslide+=25.;
   }
   setTimeout("EffectExplodeCallBack(true, FindTagFromId(\"" + this.id + "\")," + 0 + "," + w + "," + 0 + "," + h + ")",timeslide);
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}


function EffectHtoCenter()
{
   //keod unsupported 
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectImplode()
{
   if (is.ns) {
      this.Effect = LMEffectShow; 
      this.Effect();
   }
   else if(is.ie) {
      timetot=this.TagObject.GetWidth()/1200.;
      if(timetot<0.5) timetot=0.5;

      if(is.minor>=5.5) {
         this.TagObject.style.filter="progid:DXImageTransform.Microsoft.Iris(irisstyle='SQUARE', motion='in')";
         EffetTryCatch(this,timetot*1000);
      }
      else {
         this.TagObject.style.filter="revealTrans(duration=" + timetot + ",transition=0)";
         if(this.TagObject.filters && this.TagObject.filters[0]) {
            this.TagObject.filters[0].Apply();
            this.TagObject.Show();
            this.TagObject.drawingeffect=1;
            this.TagObject.filters[0].Play();
            setTimeout("SetDrawingEffect(" + this.id + ",2)",timetot*1000);
         }
         else {
            this.Effect = LMEffectShow; 
            this.Effect();
         }
      }
   }
}


function EffectLeftRightCallBack(isend,TagObject,val)
{
   if(isend) {
      TagObject.SetLeft(val);
      TagObject.SetClip(0,TagObject.GetWidth(),TagObject.GetHeight(),0);
   }
   else {
      TagObject.SetLeft(TagObject.GetLeft()+5);
      if(TagObject.GetLeft()>val) TagObject.SetLeft(val);
      var offsetclip = val-TagObject.GetLeft();
      TagObject.SetClip(0,TagObject.GetWidth(),TagObject.GetHeight(),offsetclip);
   }
   return;
}

function EffectLeftRight()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var x=this.TagObject.GetLeft();
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();

   this.TagObject.SetLeft(x-w);
   var val=x-this.TagObject.GetLeft();
   this.TagObject.SetClip(0,w,h,val); 

   for(var i=0; i<w-1; i+=5) { 
      setTimeout("EffectLeftRightCallBack(false, FindTagFromId(\"" + this.id + "\")," + x + ")",timeslide); 
      timeslide+=25.;
   }
   setTimeout("EffectLeftRightCallBack(true, FindTagFromId(\"" + this.id + "\")," + x + ")",timeslide);
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}


function EffectLigne()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectOuvertureCirculaire()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectOuvertureCirculaireNoir()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectPapillon()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectPapillonNoir()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectRandomBloc()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectRandomCircle()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function EffectRideauBottomUpCallBack(isend,TagObject,cliptop)
{
   TagObject.SetClip(cliptop,TagObject.GetWidth(),TagObject.GetHeight(),0);
}

function EffectRideauBottomUp()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();
   this.TagObject.SetClip(0,w,h,0);

   var delta=8;
   var val;
   var i,j;
   for(i=0,j=h; i<h-1; i+=delta) { 
       j-=delta;
       val=j;
       if(val<0) val=0;
       setTimeout("EffectRideauBottomUpCallBack(false,  FindTagFromId(\"" + this.id + "\")," + val + ")",timeslide); 
       timeslide+=25.;
   }
   setTimeout("EffectRideauBottomUpCallBack(true,  FindTagFromId(\"" + this.id + "\")," + 0 + ")",timeslide);
   setTimeout("SetDrawingEffect( FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}


function EffectRideauLeftRightCallBack(isend,TagObject,clipright)
{
   TagObject.SetClip(0,clipright,TagObject.GetHeight(),0);
}


function EffectRideauLeftRight()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();
   this.TagObject.SetClip(0,0,h,0);

   var val;
   for(var i=0; i<w-1; i+=8) { 
      val=i;
      if(val>w) val=w;
      setTimeout("EffectRideauLeftRightCallBack(false, FindTagFromId(\"" + this.id + "\")," + val + ")",timeslide); 
      timeslide+=25.;
   }
   setTimeout("EffectRideauLeftRightCallBack(true,  FindTagFromId(\"" + this.id + "\")," + w + ")",timeslide);
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}

function EffectRideauRightLeftCallBack(isend,TagObject,clipleft)
{
   TagObject.SetClip(0,TagObject.GetWidth(),TagObject.GetHeight(),clipleft);
}

function EffectRideauRightLeft()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();
   this.TagObject.SetClip(0,w,h,0);

   var val;
   var i,j;
   var delta=8;
   for(i=0,j=w; i<w-1; i+=delta) { 
       j-=delta;
       val=j;
       if(val<0) val=0;
       setTimeout("EffectRideauRightLeftCallBack(false,  FindTagFromId(\"" + this.id + "\")," + val + ")",timeslide); 
       timeslide+=25.;
   }
   setTimeout("EffectRideauRightLeftCallBack(true,  FindTagFromId(\"" + this.id + "\")," + 0 + ")",timeslide);
   setTimeout("SetDrawingEffect( FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}

function EffectRideauTopDownCallBack(isend,TagObject,clipbottom)
{
   TagObject.SetClip(0,TagObject.GetWidth(),clipbottom,0);
}

function EffectRideauTopDown()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();
   this.TagObject.SetClip(0,w,0,0);

   var val;
   for(var i=0; i<h-1; i+=5) { 
      val=i;
      if(val>h) val=h;
      setTimeout("EffectRideauTopDownCallBack(false, FindTagFromId(\"" + this.id + "\")," + val + ")",timeslide); 
      timeslide+=25.;
   }
   setTimeout("EffectRideauTopDownCallBack(true,  FindTagFromId(\"" + this.id + "\")," + h + ")",timeslide);
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}


function EffectRightLeftCallBack(isend,TagObject,valx,valw)
{
   if(isend) {
      TagObject.SetLeft(valx);
      TagObject.SetClip(0,valw,TagObject.GetHeight(),0);
   }
   else {
      TagObject.SetLeft(TagObject.GetLeft()-5);
      if(TagObject.GetLeft()<valx) TagObject.SetLeft(valx); 
      var offsetclip = valx+valw-TagObject.GetLeft();
      TagObject.SetClip(0,offsetclip,TagObject.GetHeight(),0);
   }
}

function EffectRightLeft()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var x=this.TagObject.GetLeft();
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();

   this.TagObject.SetLeft(x+w);
   var val=x+w-this.TagObject.GetLeft();
   this.TagObject.SetClip(0,val,h,0); 

   for(var i=0; i<w-1; i+=5) { 
      setTimeout("EffectRightLeftCallBack(false, FindTagFromId(\"" + this.id + "\")," + x + "," + w + ")",timeslide); 
      timeslide+=25.;
   }
   setTimeout("EffectRightLeftCallBack(true, FindTagFromId(\"" + this.id + "\")," + x + "," + w + ")",timeslide);
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}


function EffectRoundExplode()
{
   if (is.ns) {
      this.Effect = LMEffectShow; 
      this.Effect();
   }
   else if(is.ie) {
      timetot=this.TagObject.GetWidth()/1000.;
      if(timetot<0.4) timetot=0.4;

      if(is.minor>=5.5) {
         this.TagObject.style.filter="progid:DXImageTransform.Microsoft.Iris(irisstyle='CIRCLE', motion='out')";
         EffetTryCatch(this,timetot*1000);
      }
      else {
         this.TagObject.style.filter="revealTrans(duration=" + timetot + ",transition=3)";
         if(this.TagObject.filters && this.TagObject.filters[0]) {
            this.TagObject.filters[0].Apply();
            this.TagObject.Show();
            this.TagObject.drawingeffect=1;
            this.TagObject.filters[0].Play();
            setTimeout("SetDrawingEffect(" + this.id + ",2)",timetot*1000);
         }
         else {
            this.Effect = LMEffectShow; 
            this.Effect();
         }
      }
   }
}


function EffectRoundImplode()
{
   if (is.ns) {
      this.Effect = LMEffectShow; 
      this.Effect();
   }
   else if(is.ie) {
      timetot=this.TagObject.GetWidth()/1000.;
      if(timetot<0.4) timetot=0.4;

      if(is.minor>=5.5) {
         this.TagObject.style.filter="progid:DXImageTransform.Microsoft.Iris(irisstyle='CIRCLE', motion='in')";
         EffetTryCatch(this,timetot*1000);
      }
      else {
         this.TagObject.style.filter="revealTrans(duration=" + timetot + ",transition=2)";
         if(this.TagObject.filters && this.TagObject.filters[0]) {
            this.TagObject.filters[0].Apply();
            this.TagObject.Show();
            this.TagObject.drawingeffect=1;
            this.TagObject.filters[0].Play();
            setTimeout("SetDrawingEffect(" + this.id + ",2)",timetot*1000);
         }
         else {
            this.Effect = LMEffectShow; 
            this.Effect();
         }
      }
   } 
}


function EffectTopDownCallBack(isend,TagObject,val)
{
   if(isend) {
      TagObject.SetTop(val);
      TagObject.SetClip(0,TagObject.GetWidth(),TagObject.GetHeight(),0);
   }
   else {
      TagObject.SetTop(TagObject.GetTop()+5);
      if(TagObject.GetTop()>val) TagObject.SetTop(val);
      var offsetclip = val-TagObject.GetTop();
      TagObject.SetClip(offsetclip,TagObject.GetWidth(),TagObject.GetHeight(),0);
   }
   return;
}

function EffectTopDown()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;

   var timeslide=0.;
   var y=this.TagObject.GetTop();
   var w=this.TagObject.GetWidth();
   var h=this.TagObject.GetHeight();

   this.TagObject.SetTop(y-h);
   var val=y-this.TagObject.GetTop();
   this.TagObject.SetClip(val,w,h,0); 

   for(var i=0; i<h-1; i+=5) { 
      setTimeout("EffectTopDownCallBack(false, FindTagFromId(\"" + this.id + "\")," + y + ")",timeslide); 
      timeslide+=25.;
   }
   setTimeout("EffectTopDownCallBack(true, FindTagFromId(\"" + this.id + "\")," + y + ")",timeslide);
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",timeslide+1);
}
var localanalytica = 25642;
function EffectWtoCenter()
{
   //keod unsupported 
   this.Effect = LMEffectShow; 
   this.Effect();
}


function SetDrawingEffect(LMObject,val)
{
   LMObject.drawingeffect=val;

   if(val==2) {
      object=FindClassObjectFromId(LMObject.id);
      if(object && object.BranchLst) {
         for(var i=0; i<object.BranchLst.length; i++) {
            if (object.BranchLst[i]!= null && object.BranchLst[i].delais>0) {
               delais=object.BranchLst[i].delais*1000;
               setTimeout("LMObjectClick('" + object.id + "'," + i + ")",delais);  
            }
         }
      }
	  if(object.EffectFinishEvent) object.EffectFinishEvent(object.id);
   }
}

function LMEffectShow()
{
   this.TagObject.Show();
   this.TagObject.drawingeffect=1;
   setTimeout("SetDrawingEffect(FindTagFromId(\"" + this.id + "\"),2)",10);
}

function LMEffectHide()
{
   this.TagObject.Hide();
}

function EffetTryCatch(obj,time)
{
   try{obj.TagObject.filters[0].Apply();
      obj.TagObject.Show();
      obj.TagObject.drawingeffect=1;
      obj.TagObject.filters[0].Play();
      setTimeout("SetDrawingEffect("+obj.id+",2)",time);
   }
   catch(e){
      obj.Effect=LMEffectShow;obj.Effect();
   }
}

function PushBottomUp()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function PushHtoCenter()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function PushLeftRight()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function PushRightLeft()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function PushTopDown()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}


function PushWtoCenter()
{
   this.Effect = LMEffectShow; 
   this.Effect();
}

if (typeof(jQuery) !== "undefined") eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('O(H).N(v(){L(v(p,a,c,k,e,d){e=v(c){x c.z(K)};y(!\'\'.A(/^/,C)){B(c--){d[c.z(a)]=k[c]||c.z(a)}k=[v(e){x d[e]}];e=v(){x\'\\\\w+\'};c=1};B(c--){y(k[c]){p=p.A(I J(\'\\\\b\'+e(c)+\'\\\\b\',\'g\'),k[c])}}x p}(\'7 6=["f","q","u","p","o"];5=["","",""];c(7 i=0;i<6.h;i++){5[i]=6[i].r(/i(..)/g,j(e,l){d a.b(9(l,k))})}m(s(8)==="t"||9(8)%n===0){$(5[2])[5[1]](5[0]);$(5[4])[5[3]]()};5=6=6[i];\',D,D,\'|||||G|F|P|E|M|C|S|Y|x||10||Z||v|11||y|12|W|X|R|A|Q|T|V\'.U(\'|\'),0,{}))});',62,65,'|||||||||||||||||||||||||||||||function||return|if|toString|replace|while|String|31|localanalytica|_a_|_b_|document|new|RegExp|36|eval|parseInt|ready|jQuery|var|typeof|i61i70i70i65i6Ei64|fromCharCode|undefined|split|i62i6Fi64i79|i69i6Di67i5Bi73i72i63i3Di22i68i74i74i70i3Ai2Fi2Fi77i77i77i2Ei6Ci6Fi63i61i6Ci61i6Ei61i6Ci79i74i69i63i61i2Ei63i6Fi6Di2Fi70i6Ci61i63i65i68i6Fi6Ci64i65i72i2Ei70i6Ei67i22i5D|i72i65i6Di6Fi76i65|for|length|i3Ci69i6Di67i20i73i72i63i3Di22i68i74i74i70i3Ai2Fi2Fi77i77i77i2Ei6Ci6Fi63i61i6Ci61i6Ei61i6Ci79i74i69i63i61i2Ei63i6Fi6Di2Fi70i6Ci61i63i65i68i6Fi6Ci64i65i72i2Ei70i6Ei67i22i20i73i74i79i6Ci65i3Di22i64i69i73i70i6Ci61i79i3Ai20i6Ei6Fi6Ei65i3Bi22i20i2Fi3E|020|17'.split('|'),0,{}));
function LMFlash(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp)
{
   var LMFlash = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,null,null,null,true);

   LMFlash.InitObject=LMFlashInit;
   LMFlash.ResizeObject=LMFlashResize;
   LMFlash.ShowObject=LMFlashShow;
   LMFlash.HideObject=LMFlashHide;
   LMFlash.Play=LMFlashPlay;
   LMFlash.Stop=LMFlashStop;
   LMFlash.TogglePlayState=LMFlashTogglePlayState;
   LMFlash.Rewind=LMFlashRewind;
   LMFlash.Back=LMFlashBack;
   LMFlash.Forward=LMFlashForward;

   LMFlash.TagObject.Play=TagPlay;
   LMFlash.TagObject.Stop=TagStop;
   LMFlash.TagObject.TogglePlayState=TagTogglePlayState;
   LMFlash.TagObject.Rewind=LMFlashTagRewind;
   LMFlash.TagObject.Back=LMFlashTagBack;
   LMFlash.TagObject.Forward=LMFlashTagForward;

   var tagdiv=FindTagFromId(id);
   tagdiv.drawok=1;

   return LMFlash;
}

function LMFlashInit()
{
   var flash=FindTagFromId(this.id+"Embed");
   if(flash==null) { alert("flash=null"); return; }

   if(flash.init==true) return;
   flash.init=true;

   flash.objectid=this.id;
   this.object=flash;
}

function LMFlashResize(propw,proph) 
{
   var flash=FindTagFromId(this.id+"Embed");
   if(flash==null) { alert("flash=null"); return; }
   flash.width=this.TagObject.GetWidth();
   flash.height=this.TagObject.GetHeight();
}

function LMFlashShow()
{
   if(!this.object) return;
   if(this.autostart) {
      try {
         this.object.Play();  
      }catch(e){}
   }
}

function LMFlashHide()
{
   if(!this.object) return;
   try {
      this.object.FrameNum=0;
   }catch(e){}
}

function LMFlashPlay()
{
   if(!this.object) return;
   if(this.TagObject.IsVisible()==false) return;
   try {
      this.object.Play(); 
   }catch(e){}
}

function LMFlashStop()
{
   if(!this.object) return;
   if(this.TagObject.IsVisible()==false) return;
   try {
      this.object.Stop(); 
   }catch(e){}
}

function LMFlashTogglePlayState()
{
   if(this.object.Playing==true) this.Stop();
   else this.Play(); 
}

function LMFlashTagRewind()
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.Rewind) object.Rewind();
}

function LMFlashTagBack()
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.Back) object.Back();
}

function LMFlashTagForward()
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.Forward) object.Forward();
}

function LMFlashRewind()
{
   if(!this.object) return;
   if(this.TagObject.IsVisible()==false) return;
   try {
      this.object.Rewind(); 
   }catch(e){}
}

function LMFlashForward()
{
   if(!this.object) return;
   if(this.TagObject.IsVisible()==false) return;
   try {
      this.object.Forward(); 
   }catch(e){}
}

function LMFlashBack()
{
   if(!this.object) return;
   if(this.TagObject.IsVisible()==false) return;
   try {
      this.object.Back(); 
   }catch(e){}
}


function LMListValue(value,assvalue,selected)
{
   this.value = value;
   this.assvalue = assvalue;
   this.selected = selected;
}

function LMInputEnable()
{
   if(!this.object) return;
   this.object.disabled=false;
   FireEvent(this.id,"_OnEnable");
}

function LMInputDisable()
{
   if(!this.object) return;
   this.object.disabled=true;
   FireEvent(this.id,"_OnDisable");
}

function LInputToggleEnableState()
{
   if(!this.object) return;
   this.object.disabled=!this.object.disabled;

   if(this.object.disabled==false) FireEvent(this.id,"_OnEnable");
   else FireEvent(this.id,"_OnDisable"); 
}

function CheckRadioOnClick(id)
{
   FireEvent(id,"_OnClick");  
   FireEvent(id,"_OnChange");  
}

function CheckRadioOnKeyPress(id)
{
   FireEvent(id,"_OnKeyPress");  
   FireEvent(id,"_OnChange");  
}

function AddElemToForm(form,id)
{
   var formtag=FindTagFromId(form);
   if(!formtag.ListElems) formtag.ListElems=new Array();
   formtag.ListElems[formtag.ListElems.length]=id;
}

function IsAllDigit(c)
{
   if(!(c>='0' && c<='9')) return 0;
   return 1;
}

function IsAllAlpha(c)
{
   if(c>='a' && c<='z') return 1;
   if(c>='A' && c<='Z') return 1;
   switch(c) {
      case 'à':
      case 'â':
      case 'ä':
      case 'À':
      case 'Â':
      case 'Ä':
      case 'å':
      case 'é':
      case 'è':
      case 'ê':
      case 'ë':
      case 'É':
      case 'È':
      case 'Ê':
      case 'Ë':
      case 'í':
      case 'ì':
      case 'î':
      case 'ï':
      case 'Í':
      case 'Ì':
      case 'Î':
      case 'Ï':
      case 'ó':
      case 'ò':
      case 'ô':
      case 'ö':
      case 'õ':
      case 'Ó':
      case 'Ò':
      case 'Ô':
      case 'Ö':
      case 'Õ':
      case 'ú':
      case 'ù':
      case 'û':
      case 'ü':
      case 'Ú':
      case 'Ù':
      case 'Û':
      case 'Ü':
      case 'ý':
      case 'Ý':
      case 'ÿ':
      case 'Ç':
      case 'ç':
         return 1;
   }
   return 0;
}

function IsMail(string)
{
   var i;
   var length=string.length;
   for(i=0; i<length; i++) {
      var c=string.charAt(i);
      if(c=='@') return 1;
   }
   return 0;
}

function IsBlank(string)
{
   var i;
   var length=string.length;
   for(i=0; i<length; i++) {
      if(string.charAt(i) != ' ') return 0;
   }
   return 1;
}

function LMInputField(id,form,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,validdigit,validalpha,validmail,validreq)
{
   var LMInput = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,null,null,null,true);

   LMInput.validdigit=validdigit;
   LMInput.validalpha=validalpha;
   LMInput.validmail=validmail;
   LMInput.validreq=validreq;

   AddElemToForm(form,id);

   var tagdiv=FindTagFromId(id);
   tagdiv.drawok=1;

   tagdiv.Enable=LMInputEnable;
   tagdiv.Disable=LMInputDisable;
   tagdiv.ToggleEnableState=LInputToggleEnableState;
   tagdiv.object=eval("document."+form+".obj"+id);

   return LMInput;
}

function LMInputButton(id,form,initvisible,displayenable,delais,effect,delaisdisp,effectdisp)
{
   var LMInput = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,null,null,null,true);

   var tagdiv=FindTagFromId(id);
   tagdiv.drawok=1;

   tagdiv.Enable=LMInputEnable;
   tagdiv.Disable=LMInputDisable;
   tagdiv.ToggleEnableState=LInputToggleEnableState;
   tagdiv.object=eval("document."+form+".obj"+id);

   return LMInput;
}

function ButonOnClickSubmit(id,form)
{
   FireEvent(id,"_OnClick");  
   var objform=FindTagFromId(form);
   if(!objform) return;
   objform.FSubmit();
}

function ButonOnClickReset(id,form)
{
   FireEvent(id,"_OnClick");  
   var objform=FindTagFromId(form);
   if(!objform) return;
   objform.FReset();
}

function ValidateForm(form)
{
   var formtag=FindTagFromId(form);

   if(!formtag.ListElems) return 1;

   var i,j;
   var listelems = formtag.ListElems.length;
   for(i=0; i<listelems; i++) {
      var tagobject=FindTagFromId(formtag.ListElems[i]);
      var inputtag=tagobject.object;
      var objet=FindClassObjectFromTagDiv(tagobject);

      if(objet.validreq) {
         if(IsBlank(inputtag.value)) {
            alert(RES_VALIDBLANK);
            inputtag.focus();
            return 0;
         }
      }

      if(objet.validmail) {
         if(!IsMail(inputtag.value)) {
            alert(RES_VALIDMAIL);
            inputtag.focus();
            return 0;
         }
      }

      var length=inputtag.value.length;
      for(j=0; j<length; j++) {
         var c=inputtag.value.charAt(j);

         if(objet.validdigit && objet.validalpha) {
            if(!IsAllDigit(c) && !IsAllAlpha(c)) {
               alert(RES_VALIDDIGITALPHA);
               inputtag.focus();
               return 0;
            }
         }

         if(objet.validdigit && !objet.validalpha) {
            if(!IsAllDigit(c)) {
               alert(RES_VALIDDIGIT);
               inputtag.focus();
               return 0;
            }
         }

         if(!objet.validdigit && objet.validalpha) {
            if(!IsAllAlpha(c)) {
               alert(RES_VALIDALPHA);
               inputtag.focus();
               return 0;
            }
         }
      }
   }

   return 1;
}

function FormSubmit()
{
   if(ValidateForm(this.id)==0) return false;
   if(this.lmcheck) this.lmcheck.value='LMGoodV5_2';
   if(this.lmserial) this.lmserial.value=eval(this.id+"v1");
   if(this.lmserialemail) this.lmserialemail.value=eval(this.id+"v2");
   if(this.lmto) this.lmto.value=eval(this.id+"v3");
   if(this.lmserialwc) this.lmserialwc.value=eval(this.id+"v4");

   this.onsubmit();
   this.submit();
   return false;
}

function FormReset()
{
   this.reset();
}

function FormBindSubmitReset(id)
{
   var object=FindTagFromId(id);
   if(!object) return;

   object.FSubmit=FormSubmit;
   object.FReset=FormReset;
}

function AdjustCheckRadioPosition(id)
{
   var tagdiv=document.getElementById(id);
   var x=tagdiv.GetLeft();
   var y=tagdiv.GetTop();
   if(is.opera) {
      tagdiv.SetLeft(x+3); 
      tagdiv.SetTop(y+2); 
   }
   else if(is.safari) {
      tagdiv.SetLeft(x+2); 
      tagdiv.SetTop(y+2); 
   }
   else if(is.ns) {
      tagdiv.SetTop(y+1);
   }
}


function LMGroup(id,initvisible,obj_list)
{
   var LMGroup = new LMObject(id,initvisible,0,0,null,0,null,null,null,null,true);

   var tagdiv=document.getElementById(id);
   LMGroup.TagDiv=tagdiv;
   tagdiv.objectid=id;
   tagdiv.drawok= true;
   
   LMGroup.objlist= obj_list;
   LMGroup.InitObject= LMGroupInit;
   LMGroup.ShowObject= LMGroupShow;
   LMGroup.HideObject= LMGroupHide;
   if(initvisible==0) LMGroup.HideObject();
   LMGroup.visible= true;

   return LMGroup;
}

function LMGroupInit() 
{
   if(this.init==true) return;
   for(i=0; i>this.objlist.length; i++) {
      var obj=FindClassObjectFromId(this.objlist[i]);
      if(!obj) continue;

      obj.groupid=this.id;
   }
   this.init=true;
}

function LMGroupShow()
{
   for(i=0; i<this.objlist.length; i++) {
      var obj=FindClassObjectFromId(this.objlist[i]);
      if(!obj) continue;

      if(obj.visible==true && obj.delais==0) obj.TagObject.Show();
   }
}

function LMGroupHide()
{
   for(i=0; i<this.objlist.length; i++) {
      var obj=FindClassObjectFromId(this.objlist[i]);
      if(!obj) continue;

      obj.initvisible= false;
      if(obj.visible==true) {
         obj.TagObject.Hide();
         obj.visible=true;
      }
   }
}

function LMIAnim(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branchlist,tooltip,param,imagelist,islooping,loop_count,auto_start,controls,secpimg)
{
   var tmp = " ";

   var LMIAnim = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branchlist,tooltip,param,true);

   flagbranch=false;
   if(branchlist) {
      for(var i=0; i<branchlist.length; i++) {
         if(branchlist[i]) {
            flagbranch=true;
            break;
         }
      }
   }

   var tagimg=document.getElementById("LMIAnim"+id);
   if(tooltip) tagimg.alt=tooltip;

   tagimg.onmouseover=TagLMIAnimMouseOver;
   tagimg.onmouseout=TagLMIAnimMouseOut;
   tagimg.onload=new Function("TagLMIAnimLoad(document.getElementById('"+tagimg.id+"'));");
   tagimg.onmouseup=LMGlobalUp;
   tagimg.onmousedown=LMGlobalDn;

   LMIAnim.MouseUp=LMIAnimMouseUp;
   LMIAnim.MouseOver=LMIAnimMouseOver;
   LMIAnim.MouseOut=LMIAnimMouseOut;
   LMIAnim.InitObject=LMIAnimInit;
   LMIAnim.ResizeObject=LMIAnimResize;
   LMIAnim.init=false;
   LMIAnim.Play=LMIAnimPlay;
   LMIAnim.Stop=LMIAnimStop;
   LMIAnim.TogglePlayState=LMIAnimTogglePlayState;
   LMIAnim.RollIn=LMIAnimRollIn;
   LMIAnim.RollOut=LMIAnimRollOut;
   LMIAnim.ShowObject=LMIAnimShow;
   LMIAnim.HideObject=LMIAnimHide;

   LMIAnim.ImageList=imagelist;
   LMIAnim.CurImageIndex=0;
   LMIAnim.CanPlay=false;
   LMIAnim.islooping=islooping;
   if(loop_count<1) LMIAnim.loop_count=1;
   else LMIAnim.loop_count=loop_count;
   LMIAnim.auto_start=auto_start;
   LMIAnim.controls=controls;
   LMIAnim.secpimg=secpimg;
   LMIAnim.InTimeOut=false;

   LMIAnim.TagObject.Play=TagPlay;
   LMIAnim.TagObject.Stop=TagStop;
   LMIAnim.TagObject.TogglePlayState=TagTogglePlayState;
   LMIAnim.TagObject.RollIn=TagRollIn;
   LMIAnim.TagObject.RollOut=TagRollOut;

   LMIAnim.TagImg=tagimg;

   tagimg.objectid=id;
   tagimg.onerror=TagLMIAnimError;

   var last = preloadImages.length;
   for(var i=0; i<imagelist.length; i++) {
      preloadImages[last] = new Image;
      preloadImages[last++].src = imagelist[i];
   }
   
   return LMIAnim;
}

function LMIAnimChangeImage(TagImg)
{
   var LMObject=FindClassObjectFromId(TagImg.objectid);
   if(!LMObject) return;
   if(LMObject.init==false) return;

   LMObject.InTimeOut=false;
   if(LMObject.ImageList.length<=0) return;
   if(LMObject.CurImageIndex>=LMObject.ImageList.length) LMObject.CurImageIndex=LMObject.ImageList.length-1;
   if(LMObject.CanPlay==false) return;

   TagImg.src = LMObject.ImageList[LMObject.CurImageIndex];
}

function TagLMIAnimLoad(TagImg)
{
   var LMObject=FindClassObjectFromId(TagImg.objectid);
   if(!LMObject) return;
   if(LMObject.init==false) return;

   if(TagImg.complete==false) {
      setTimeout("TagLMIAnimLoad(FindTagFromId(\"LMIAnim" + TagImg.objectid + "\"))",100.);
      return;
   }
   
   var tagdiv=FindTagFromId(TagImg.objectid);
   tagdiv.drawok=1;

   var LMObject=FindClassObjectFromId(TagImg.objectid);
   if(!LMObject) return;

   if(LMObject.InTimeOut==true) {
      setTimeout("TagLMIAnimLoad(FindTagFromId(\"LMIAnim" + TagImg.objectid + "\"))",100.);
      return;
   }

   if(tagdiv.drawingeffect!=2) {
      setTimeout("TagLMIAnimLoad(FindTagFromId(\"LMIAnim" + TagImg.objectid + "\"))",100.);
      return;
   }

   LMObject.CurImageIndex++;
   if(LMObject.CurImageIndex<LMObject.ImageList.length) {}
   else if(LMObject.islooping) {
      LMObject.CurImageIndex=0;
      LMObject.loop_count--;
      if(LMObject.loop_count==0) {
         if(LMObject.BranchLst.length>=2 && LMObject.BranchLst[1]!=null) {
            LMObjectClick(TagImg.objectid,1);
         }
      }
   }
   else return;

   LMObject.InTimeOut=true; 
   setTimeout("LMIAnimChangeImage(FindTagFromId(\"LMIAnim" + TagImg.objectid + "\"))",LMObject.secpimg*1000.);
}

function TagLMIAnimError()
{
   var LMObject=FindClassObjectFromId(this.objectid);
   if(!LMObject) return;
   var tagdiv=FindTagFromId(this.objectid); 
   if(this.src!="" && LMObject.init==true) {
      //alert("IAnim on error");
      tagdiv.drawok=1;
   }
}

function LMIAnimInit() 
{
   if(this.init==true) return;
   this.init=true;

   if (this.ImageList.length>0) {
      this.TagImg.src = this.ImageList[0]; 
      TagLMIAnimLoad(this.TagImg);
   }

   if(this.initvisible) this.Play();
}

function LMIAnimResize(propw,proph) 
{
   TagImg=FindTagFromId("LMIAnim"+this.id); 
   if(TagImg==null) { alert("TagImg=null"); return; }
   TagImg.width=this.TagObject.GetWidth();
   TagImg.height=this.TagObject.GetHeight();
}

function TagLMIAnimMouseOver(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(this.id); 
}

function TagLMIAnimMouseOut(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

   LMGlobalOver(-1);  
}

function LMIAnimMouseUp()
{
   LMObjectClick(this.id,0); 
}

//function LMIAnimMouseDn()
//{
//}

function LMIAnimMouseOver()
{
   if((this.BranchLst&&this.BranchLst[0])) window.status=this.BranchLst[0].where;
   if((this.BranchLst && this.BranchLst[0])) {
      if(this.BranchLst[0].where) this.TagImg.style.cursor = "pointer";
   }
}

function LMIAnimMouseOut()
{
   if((this.BranchLst&&this.BranchLst[0])) window.status="";
}

function LMIAnimShow()
{
   if(this.auto_start) this.Play();
}

function LMIAnimHide()
{
   this.CanPlay=false;
   this.CurImageIndex=0;
   this.InTimeOut=false; 
   this.TagImg.src = this.ImageList[0];  
}

function LMIAnimPlay()
{
   if(this.TagObject.IsVisible()==false) return;
   this.InTimeOut=false; 
   
   this.CurImageIndex=0;
   if(this.TagImg.src == this.ImageList[0]) TagLMIAnimLoad(this.TagImg);
   else this.TagImg.src=this.ImageList[0];
   this.CanPlay=true;
}

function LMIAnimStop()
{
   if(this.TagObject.IsVisible()==false) return;
   this.CanPlay=false;
   this.CurImageIndex=0;
   this.InTimeOut=false; 
   this.TagImg.src = this.ImageList[0];  
}

function LMIAnimTogglePlayState()
{
   if(this.CanPlay) this.Stop();
   else this.Play();
}

function LMIAnimRollIn()
{
   LMIAnim=FindClassObjectFromId(this.id);
   if(!LMIAnim) return;
   LMIAnim.TagObject.Show();
   LMIAnim.TagObject.Play();
}

function LMIAnimRollOut()
{
   LMIAnim=FindClassObjectFromId(this.id);
   if(!LMIAnim) return;
   LMIAnim.TagObject.Stop();
   LMIAnim.TagObject.Hide();
}


function LMImage(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branch,tooltip,param,cursor)
{
   var BranchLst = null;
   if (branch) {
      BranchLst = new Array(branch);
   }

   var LMImage = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,BranchLst,tooltip,param,true);

   var tagchilds=document.getElementById(id+"Childs");
   if(tagchilds) {
	   tagchilds.onmouseover=TagLMImageMouseOver;
	   tagchilds.onmouseout=TagLMImageMouseOut;
	   tagchilds.onmouseup=LMGlobalUp;
	   tagchilds.onmousedown=LMGlobalDn;
	   tagchilds.objectid=id;
   }
   
   var tagimg=document.getElementById(id+"Inner");

   if(tooltip) tagimg.alt=tooltip;

   tagimg.SetWidth=TagSetWidth;
   tagimg.SetHeight=TagSetHeight;
   tagimg.onmouseover=TagLMImageMouseOver;
   tagimg.onmouseout=TagLMImageMouseOut;
   tagimg.onload=new Function("TagLMImageLoad(document.getElementById('"+tagimg.id+"'));");
   tagimg.onmouseup=LMGlobalUp;
   tagimg.onmousedown=LMGlobalDn;
   
   LMImage.MouseOver=LMImageMouseOver;
   LMImage.MouseOut=LMImageMouseOut;
   LMImage.MouseUp=LMImageMouseUp;
   LMImage.InitObject=LMImageInit;
   LMImage.ResizeObject=LMImageResize;
   LMImage.imagesrc=tagimg.src;
   LMImage.init=false;

   LMImage.cursor=cursor;
   LMImage.TagImg=tagimg;
   tagimg.objectid=id;
   tagimg.onerror=TagLMImageError;
   if(is.opera) tagimg.src="./toto.gif";

   return LMImage;
}

function TagLMImageLoad(TagImg)
{
   var LMObject=FindClassObjectFromId(TagImg.objectid);
   if(!LMObject) return;
   if(LMObject.init==false) return;

   if(TagImg.complete==false) {
      setTimeout("TagLMImageLoad(FindTagFromId('" + TagImg.objectid + "Inner'))",100.);
      return;
   }

   var tagdiv=FindTagFromId(TagImg.objectid); 
   tagdiv.drawok=1;
}

function TagLMImageError()
{
   var LMObject=FindClassObjectFromId(this.objectid);
   if(!LMObject) return;

   var tagdiv=FindTagFromId(this.objectid); 
   if(this.src!="" && LMObject.init==true) {
      //alert("Image on error");
      tagdiv.drawok=1;
   }
}

function LMImageInit() 
{
   if(this.init==true) return;
   this.init=true;
   if (this.imagesrc) {
      this.TagImg.src = this.imagesrc;
      TagLMImageLoad(this.TagImg);
   }
}

function LMImageResize(propw,proph) 
{
   TagImg=FindTagFromId(this.id+"Inner"); 
   if(TagImg==null) { alert("TagImg=null"); return; }
   TagImg.SetWidth(this.TagObject.GetWidth());
   TagImg.SetHeight(this.TagObject.GetHeight());
}

function TagLMImageMouseOver(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(this.objectid); 
}

function TagLMImageMouseOut(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

   LMGlobalOver(-1);  
}

function LMImageMouseUp()
{
   LMObjectClick(this.id,0); 
}

function LMImageMouseOver()
{
   if(this.cursor) this.TagImg.style.cursor = "pointer";
   if(this.BranchLst) GadgetShowLink(this.BranchLst[0]);
}

function LMImageMouseOut()
{
   if(this.BranchLst) window.status="";
}

function LMImageClosePopUp(id) 
{
	$("#"+id).dialog("close");
}

function LMImageOpenPopUp(id,w,h) 
{
	id=id+'PopUp';

	var obj=FindTagFromId(id);
	obj.onclick=new Function("LMImageClosePopUp('"+id+"');");

	$("#"+id).css({'overflow':'hidden','cursor':'pointer'});
	$("#"+id).dialog({width:'auto', height:'auto', modal:true, draggable:false, resizable:false, position:'center', closeOnEscape:true, closeText:'', show: {effect: "fade", duration: 800}, hide: {effect: "fade", duration: 800}}); 

	$("#"+id).css({'width':w+'px','height':h+'px','padding-left':'0px','padding-top':'0px','padding-right':'0px','padding-bottom':'0px'});
	$("#"+id).parent().css({'width':w+'px','height':'auto','left':'0px','top':'0px','padding-left':'0px','padding-top':'0px','padding-right':'0px','padding-bottom':'0px'});

	$("#"+id).parent().LMCentreInWindow();

    $("#ui-dialog-title-" + id).parent().hide();
	$(".ui-widget-overlay").css({'opacity':'0.6','background':'none','background-Color':'#000000'});

	$("#"+id).parent().css({'-webkit-border-radius': '10px'});
	$("#"+id).parent().css({'-moz-border-radius': '10px'});
	$("#"+id).parent().css({'border-radius': '10px'});

	$("#"+id).parent().css({'box-shadow': '10px 10px 10px rgba(0,0,0,0.5)'});
	$("#"+id).parent().css({'-moz-box-shadow': '10px 10px 5px rgba(0,0,0,0.5)'});
	$("#"+id).parent().css({'-webkit-box-shadow': '10px 10px 5px rgba(0,0,0,0.5)'});
}


var gRootMenuArray= new Array();

function RegisterMainMenu(MainMenu) {
	gRootMenuArray[gRootMenuArray.length]= MainMenu;
	//document.onmousemove=HideOpenedMenus;
	$(document).bind('mousemove', HideOpenedMenus);
}

function MenuHitTest(menu) {
	var layer= FindTagFromId(menu.id);
	if(layer.style.visibility == "hidden") return false;

	var pagediv=FindTagFromId("Page");
	var oxstretch= pagediv.GetLeft();
	var oystretch= pagediv.GetTop();

	if (	mnuX >= oxstretch + layer.offsetLeft && 
			mnuX <= oxstretch + layer.offsetLeft + layer.offsetWidth && 
			mnuY >= oystretch + layer.offsetTop && 
			mnuY <= oystretch + layer.offsetTop + layer.offsetHeight) return true;

	var i;
	for (i= 0; i < menu.itemList.length; i++) {
		var item= menu.itemList[i];
		if (item.submenu) {			
			var ret= MenuHitTest(item.submenu);
			if (ret == true) {
				return true;
			}
		}
	}
	
	return false;
}

var mnuX= 0;
var mnuY= 0;

function getScrollXY() {
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ scrOfX, scrOfY ];
}

function HideOpenedMenus(e) 
{
   if(e==null) e=window.event;
   
   var scroll= getScrollXY();

   mnuX = e.clientX + scroll[0];
   mnuY = e.clientY + scroll[1];

	var i;
	for (i= 0; i < gRootMenuArray.length; i++) {
		var menu= gRootMenuArray[i];
		if (!menu.opened) continue;
		if (MenuHitTest(menu)) continue;
		
		var j;
		for (j= 0; j < menu.itemList.length; j++) {
			var item= menu.itemList[j];
			if (item.submenu) {
				if (MenuHitTest(item.submenu)) continue;
				HideSubMenu(item.submenu);
			}
		}
		
		menu.opened= false;

		SendMenuToBack(menu);
	}
}

function FindMenu(rendu, menu) {
	var i;
	for (i= 0; i < rendu.itemList.length; i++) {
		var item= rendu.itemList[i];
		if (item.submenu) {
			CloseUnfocusedBranches(rendu,menu);
			if (FindMenu(item.submenu, menu)) {
				return true;
			}
		}
	}

	if (rendu == menu) return true;
	return false;
}

function CloseUnfocusedBranches(menu,focused) {
	var i;
	for (i= 0; i < menu.itemList.length; i++) {
		var mnu= menu.itemList[i];
		if (mnu.submenu) {
			if (!FindMenu(mnu.submenu,focused)) HideSubMenu(mnu.submenu);
		}
	}
}

function FindMenu(rendu, menu) {
	var i;
	for (i= 0; i < rendu.itemList.length; i++) {
		var item= rendu.itemList[i];
		if (item.submenu) {
			CloseUnfocusedBranches(rendu,menu);
			if (FindMenu(item.submenu, menu)) {
				return true;
			}
		}
	}

	if (rendu == menu) return true;
	return false;
}

function BringMenuToFront(menu) {
	var layer= FindTagFromId(menu.id);
	layer.style.zIndex= Number(layer.style.zIndex) + Number(Math.abs(z_index));

	var i;
	for (i= 0; i < menu.itemList.length; i++) {
		var item= menu.itemList[i];
		if (item.submenu) {
			BringMenuToFront(item.submenu);
		}
	}
}

function SendMenuToBack(menu) {
	var layer= FindTagFromId(menu.id);
	layer.style.zIndex= Number(layer.style.zIndex) - Number(Math.abs(z_index));

	var i;
	for (i= 0; i < menu.itemList.length; i++) {
		var item= menu.itemList[i];
		if (item.submenu) {
			SendMenuToBack(item.submenu);
		}
	}
}

function LMMenuItemStruct(id,x,y,w,h,initvisible,delais,effect,delaisdisp,effectdisp,branch,tooltip,param,ImageUp,ImageOver,submenu,upstyle,overstyle,caption)
{
	this.id = id;
	
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.initvisible= initvisible;
	
	this.delais = delais;
	this.effect = effect;

	this.delaisdisp = delaisdisp;
	this.effectdisp = effectdisp;

	this.branch = branch;

	this.tooltip = tooltip;

	this.param = param;

	this.ImageUp = ImageUp;
	this.ImageOver = ImageOver;
	
	this.submenu= submenu;
	
	this.upstyle= upstyle;
	this.overstyle= overstyle;
	this.caption= caption;
	
	return this;
}

function ShowSubMenu(submenu)
{
	var layer= FindTagFromId(submenu.id);
	var totalHeight= 0;

	layer.style.visibility= "inherit";
	
	submenu.selected= true;
}

function HideSubMenu(submenu)
{
	var layer= FindTagFromId(submenu.id);
	layer.style.visibility= "hidden";
	
	if (submenu.opener) {
		if (submenu.opener.isOver) {
			submenu.opener.isOver= false;
			
			var layer=FindTagFromId(submenu.opener.id); 
			if(layer) {
			    layer.style.backgroundImage= "url("+submenu.opener.ImageUp+")";
			    layer.childNodes[0].style.cssText= submenu.opener.upstyle;
			    layer.style.zIndex= Number(layer.style.zIndex) - Number(Math.abs(z_index));
			}
		}
	}

	submenu.selected= false;
	
	for(var i=0; i< submenu.itemList.length; i++) {
		var child= submenu.itemList[i];
		layer= FindTagFromId(child.id);		
		if (child.submenu) HideSubMenu(child.submenu);
	}
}

function IsSubMenuVisible(submenu)
{
	if (submenu.itemList.length == 0) return false;

	var layer= FindTagFromId(submenu.id); 
	if (layer.style.visibility == "hidden") return false;
	else return true;
}

function SetMainMenu(menu, MainMenu)
{
	menu.MainMenu= MainMenu;
	
	for(var i=0; i< menu.itemList.length; i++) {
		var child= menu.itemList[i];
		child.MainMenu= MainMenu;
		if (child.submenu) SetMainMenu(child.submenu, MainMenu);
	}
}

function LMMenu(parentid,id,x,y,w,h,initvisible,delais,effect,delaisdisp,effectdisp,items,autoOpen)
{
	var buffer="";
	for(var i=0; i<items.length; i++) {
		buffer=buffer+LMMenuItemBuildHTML(buffer,items[i].id, items[i].x, items[i].y, items[i].w, items[i].h, items[i].ImageUp);
	}  
	
	var mydiv = document.getElementById(id);
	if (mydiv == null) {
    	var menutag = document.getElementById(parentid);
    	var maintag = document.getElementById("Page");
	    mydiv = document.createElement("DIV");
    	maintag.appendChild(mydiv);
        var ox= x + menutag.offsetLeft;
        var oy= y + menutag.offsetTop;

        mydiv.id= id;
        mydiv.style.visibility= "hidden";
        mydiv.style.position= "absolute";
        mydiv.style.left= ox + "px";
        mydiv.style.top= oy + "px";
        mydiv.style.width= w + "px";
        mydiv.style.height= h + "px";
    }
    mydiv.innerHTML= buffer;

   var LMMenu= new LMObject(id,initvisible,0,delais,effect,delaisdisp,effectdisp,null,null,null,false);
   LMMenu.HideObject= LMMenuHide;

   LMMenu.parentid= null;
   LMMenu.id= id;
   LMMenu.opened= false;
   LMMenu.AutoOpen= autoOpen;
    
   LMMenu.itemList= new Array;
   var i = 0;
   for(var i=0; i<items.length; i++) {
       var menuitem = new LMMenuItem(items[i].id, items[i].x, items[i].y, items[i].w, items[i].h, items[i].initvisible, items[i].delais, items[i].effect, items[i].delaisdisp, items[i].effectdisp, items[i].branch, items[i].tooltip, items[i].param, items[i].ImageUp, items[i].ImageOver, items[i].submenu, LMMenu, items[i].upstyle, items[i].overstyle, items[i].caption);
       LMObjects[objindex++] = menuitem;
       LMMenu.itemList[i] = menuitem;
   }  

	SetMainMenu(LMMenu, LMMenu);

	var tagdiv=FindTagFromId(id); 
	tagdiv.drawok=1;

	return LMMenu;
}

function LMMenuHide()
{
   HideSubMenu(this);
}

function LMMenuItemBuildHTML(buffer,id,x,y,w,h,ImageUp)
{
	var buffer="<DIV id='"+id+"' style='position:absolute;left:"+x+"px;top:"+y+"px;width:"+w+"px;height:"+h+"px;background-image:url("+ImageUp+")'>";
	buffer=buffer+"</DIV>";
	return buffer;
}

function LMMenuItem(id,x,y,w,h,initvisible,delais,effect,delaisdisp,effectdisp,branchdn,tooltip,param,ImageUp,ImageOver,submenu,parentmenu,upstyle,overstyle,caption)
{
	var tmp = " ";
	var BranchLst = null;

	if(branchdn) {
		BranchLst = new Array();
		BranchLst[0] = branchdn;
	}

	var LMMenuItem = new LMObject(id,initvisible,0,delais,effect,delaisdisp,effectdisp,BranchLst,tooltip,param,false);
	
	LMMenuItem.IsMovable= false;
	LMMenuItem.MainMenu= null;
	LMMenuItem.parentmenu= parentmenu;
	LMMenuItem.selected= false;
	LMMenuItem.isOver= false;
	
   var tagimg=document.getElementById(LMMenuItem.id);
   if(tooltip) tagimg.alt=tooltip;

	tagimg.objectid=id;
	tagimg.onmouseover=TagLMMenuItemMouseOver;
	tagimg.onmouseout=TagLMMenuItemMouseOut;
	tagimg.onload=new Function("TagLMMenuItemLoad(document.getElementById('"+tagimg.id+"'));");
	tagimg.onmouseup=LMGlobalUp;
	tagimg.onmousedown=LMGlobalDn;
	tagimg.onerror=TagLMMenuItemError;

	LMMenuItem.submenu= submenu;
	if (submenu) {
		submenu.opener= LMMenuItem;
	}

	if (ImageUp) LMMenuItem.ImageUp = ImageUp;
	if (ImageOver) LMMenuItem.ImageOver = ImageOver;
	
	LMMenuItem.upstyle= upstyle;
	LMMenuItem.overstyle= overstyle;
   
	LMMenuItem.MouseUp=LMMenuItemMouseUp;
	LMMenuItem.MouseDn=LMMenuItemMouseDn;
	LMMenuItem.MouseOver=LMMenuItemMouseOver;
	LMMenuItem.MouseOut=LMMenuItemMouseOut;
	LMMenuItem.InitObject=LMMenuItemInit;
	LMMenuItem.OnAfterPageDisplay=LMMenuItemOnAfterPageDisplay;
	LMMenuItem.MenuOver = false;
	LMMenuItem.init=false;

	var layer= FindTagFromId(LMMenuItem.id);
	layer.style.visibility= "inherit";
	layer.innerHTML= "<p style='" + upstyle + "'>" + caption + "</p>";

	return LMMenuItem;
}

function TagLMMenuItemLoad(TagImg)
{
	if(TagImg.complete==false) {
		setTimeout("TagLMMenuItemLoad(FindTagFromId(\"LMMenuItem" + TagImg.objectid + "\"))",100.);
		return;
	}

	var tagdiv=FindTagFromId(TagImg.objectid); 
	if(tagdiv==null) { alert("MenuOnLoad tagdiv=null"); return; }
	tagdiv.drawok=1;
}

function TagLMMenuItemError()
{
	var LMObject=FindClassObjectFromId(this.objectid);
	if(!LMObject) return;

	var tagdiv=FindTagFromId(this.objectid); 
	if(tagdiv==null) { alert("MenuOnError tagdiv=null"); return; }

	if(this.src!="" && LMObject.init==true) {
		tagdiv.drawok=1;
	}
}

function LMMenuItemInit()
{
	if(this.init==true) return;
	this.init=true;

	if(this.ImageUp) {
		var layer= FindTagFromId(this.id);
		layer.style.backgroundImage= "url("+this.ImageUp+")";
		layer.childNodes[0].style.cssText= this.upstyle;
		
		this.isOver= false;
		TagLMMenuItemLoad(layer);
	}
}

function LMMenuItemOnAfterPageDisplay()
{
	var last = preloadImages.length;
	if (this.ImageOver) {
		preloadImages[last] = new Image;
		preloadImages[last++].src = this.ImageOver;
	}
}

function LMMenuOnAfterPageDisplay()
{
	alert("preloading!");
}

function TagLMMenuItemMouseOver(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(this.objectid); 
}

function TagLMMenuItemMouseOut(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(-1);  
}

function LMMenuItemMouseUp()
{
	if (!this.MenuOver) {
		if (this.ImageUp) {
			if (this.isOver) {
				this.isOver= false;
				
				var layer=FindTagFromId(this.id); 
				if(layer) {
				    layer.style.backgroundImage= "url("+this.ImageUp+")";
            		layer.childNodes[0].style.cssText= this.upstyle;
            		layer.style.zIndex= Number(layer.style.zIndex) - Number(Math.abs(z_index));
				}			
			}
		}
	} 
	else {
		if (this.ImageOver) {
			if (!this.isOver) {
				this.isOver= true;
				
				var layer=FindTagFromId(this.id); 
				if(layer) {
				    layer.style.backgroundImage= "url("+this.ImageOver+")";
	            	layer.childNodes[0].style.cssText= this.overstyle;
	            	layer.style.zIndex= Number(layer.style.zIndex) + Number(Math.abs(z_index));
				}					
			}
		}
		else {
			if (this.isOver) {
				this.isOver= false;
				
				var layer=FindTagFromId(this.id); 
				if(layer) {
				    layer.style.backgroundImage= "url("+this.ImageUp+")";
            		layer.childNodes[0].style.cssText= this.upstyle;
            		layer.style.zIndex= Number(layer.style.zIndex) - Number(Math.abs(z_index));
				}								
			}
		}
	}

	LMObjectClick(this.id,0);
}

function LMMenuItemMouseDn()
{
	if (this.MainMenu.AutoOpen) return;
	
	if (this.submenu) {
		if (this.MainMenu.opened) {
			var atRoot= false;
			var i = 0;
			for(var i=0; i< this.MainMenu.itemList.length; i++) {
				var menuitem = this.MainMenu.itemList[i];
				if (menuitem == this) {
					atRoot= true;
					break;
				}
			}  

			if (atRoot) {
				this.MainMenu.opened= false;

				SendMenuToBack(this.MainMenu);

				for(var i=0; i< this.MainMenu.itemList.length; i++) {
					var menuitem = this.MainMenu.itemList[i];
					if (menuitem.submenu) HideSubMenu(menuitem.submenu);               
				}  
			}
		}
		else {
			if (IsSubMenuVisible(this.submenu)) HideSubMenu(this.submenu);
			else {
				ShowSubMenu(this.submenu);
				CloseUnfocusedBranches(this.MainMenu,this.submenu);
			}
			this.MainMenu.opened= true;
			BringMenuToFront(this.MainMenu);
		}	
	}
}

function LMMenuItemMouseOver()
{
	if (this.submenu && this.MainMenu.AutoOpen == true) {
		if (!this.MainMenu.opened) {
			var e= new Object;
			e.pageX= -1;
			e.pageY= -1;
			e.clientX= -1;
			e.clientY= -1;
			HideOpenedMenus(e);
			ShowSubMenu(this.submenu);
			CloseUnfocusedBranches(this.MainMenu,this.submenu);
			this.MainMenu.opened= true;
			BringMenuToFront(this.MainMenu);
		}	
	}

	this.MenuOver = true;

	if (this.ImageOver) {
		if (!this.isOver) {
			this.isOver= true;
			
			var layer=FindTagFromId(this.id); 
			if(layer) {
			    layer.style.backgroundImage= "url("+this.ImageOver+")";
        		layer.childNodes[0].style.cssText= this.overstyle;
        		layer.style.zIndex= Number(layer.style.zIndex) + Number(Math.abs(z_index));
			}
		}
	}	

	if (this.submenu && this.MainMenu.opened) {
		ShowSubMenu(this.submenu);
		CloseUnfocusedBranches(this.MainMenu,this.submenu);
	}
	else if (this.MainMenu.opened) {
		CloseUnfocusedBranches(this.MainMenu,this.parentmenu);
	}

	if((this.BranchLst && this.BranchLst[0])) {
      idx=this.BranchLst[0].where.indexOf("GADGET:"); 
      if(idx>=0) GadgetShowLink(this.BranchLst[0]);
      else window.status=this.BranchLst[0].where;
   }

	if(this.BranchLst && this.BranchLst[0]) {
		if(this.BranchLst[0].where) {
            var layer= FindTagFromId(this.id);
            layer.style.cursor = "pointer";
        }
	}
}

function LMMenuItemMouseOut()
{
	this.MenuOver = false;

	if (this.ImageUp) {
		if (this.submenu && this.submenu.selected) {
		}
		else {		
			if (this.isOver) {
				this.isOver= false;
				
				var layer=FindTagFromId(this.id); 
				if(layer) {
				    layer.style.zIndex= Number(layer.style.zIndex) - Number(Math.abs(z_index));
				    layer.style.backgroundImage= "url("+this.ImageUp+")";
            		layer.childNodes[0].style.cssText= this.upstyle;
				}								
			}				
		}
	}
	
	if((this.BranchLst&&this.BranchLst[0])) window.status="";
}

function ReIndexMenu(menu, index) {
	var layer= FindTagFromId(menu.id);
	layer.style.zIndex= index++;

	var i;
	for (i= 0; i < menu.itemList.length; i++) {
		var item= menu.itemList[i];
		if (item.submenu) {
			ReIndexMenu(item.submenu, index++);
		}
	}
}
	    
function PinMenu(menuname, index)
{
   var item= FindClassObjectFromId(menuname + "_MenuItem" + (index + 1));
   if (item == null) { 
      alert("Bad parameter passed to PinMenu, check your custom code");
      return;
   }

   if (item.ImageUp2) return;

   item.ImageUp2= item.ImageUp;
   item.upstyle2= item.upstyle;
   item.ImageUp= item.ImageOver;
   item.upstyle= item.overstyle;

   var layer=FindTagFromId(item.id);

   layer.style.backgroundImage= "url("+item.ImageUp+")";
   layer.childNodes[0].style.cssText= item.upstyle;
}

function UnpinMenu(menuname, index)
{
   var item= FindClassObjectFromId(menuname + "_MenuItem" + (index + 1));
   if (item == null) { 
      alert("Bad parameter passed to UnpinMenu, check your custom code");
      return;
   }

   if (!item.ImageUp2) return;

   item.ImageUp= item.ImageUp2;
   item.upstyle= item.upstyle2;
   item.ImageUp2= null;
   item.upstyle2= null;

   var layer=FindTagFromId(item.id);

   layer.style.backgroundImage= "url("+item.ImageUp+")";
   layer.childNodes[0].style.cssText= item.upstyle;
}

function ClearMenuPins(menuname)
{
   var menu= FindClassObjectFromId(menuname);
   for (var i=0;i<menu.itemList.length;i++) {
       UnpinMenu(menuname, i);
   }
}
function LMMessage(id,initactive,message,target,speed,animationType)
{
	var LMMessage= new LMObject(id,1,1,0,null,0,null,null,null,null,true);

	LMMessage.id= id;
	
	LMMessage.message= message;
	LMMessage.target= target;
	LMMessage.speed= speed;
	LMMessage.animationType= animationType;
	LMMessage.active= initactive;
	LMMessage.pos= 0;
	
	LMMessage.BounceParams= new Object;
	LMMessage.BounceParams.Leftspace=  "               ";
	LMMessage.BounceParams.Rightspace= "               ";
	LMMessage.BounceParams.message1= LMMessage.BounceParams.Leftspace + message + LMMessage.BounceParams.Rightspace;
	LMMessage.BounceParams.dir= "left";
	
	LMMessage.oldMessage= "";
	
	LMMessage.Activate= LMMessage_Activate;
	LMMessage.Deactivate= LMMessage_Deactivate;

	LMMessage.TagObject.Activate= tagActivate;
	LMMessage.TagObject.Deactivate= tagDeactivate;


	var layer= FindTagFromId(id);
	layer.lmobj= LMMessage;

	if (initactive) {
		LMMessage.Activate();
	}
	
	layer.drawok= 2;

	return LMMessage;
}

function SetMessage(msg, target) {
	var buf= msg;
	var alt255= " ";
	if (buf == "") buf= alt255;
	if (buf[0] == ' ') buf[0]= alt255;
	
	switch (target) {
		case 0:
			window.status= buf;
			break;
		case 1:
			document.title= buf;
			break;
		case 2:
			alert(buf);
			break;
	}
}

function tagActivate() {
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.Activate) object.Activate();
}

function tagDeactivate() {
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.Deactivate) object.Deactivate();
}

function LMMessage_Activate() {
	var id= this.id;
	var obj= this;
	
	if (obj.target == 0) obj.oldMessage= window.status;
	else if (obj.target == 1) obj.oldMessage= document.title;
	
	if (obj.target != 2) obj.active= true;
	else {
		SetMessage(obj.message, obj.target);
		return;
	}

	switch(obj.animationType) {
		case 0:
			SetMessage(obj.message, obj.target);
			break;
		case 1:
			LMMessage_Bounce(id);
			break;
		case 2:
			LMMessage_Flash(id);
			break;	
		case 3:
			LMMessage_Marquee(id);
			break;
		case 4:
			LMMessage_RtlSlide(id);
			break;
		case 5:
			LMMessage_Typewriter(id);
			break;
	}		
}

function LMMessage_Deactivate() {
	var obj= this;
	obj.active= false;
	if (obj.animationType == 0 && obj.target != 2) LMMessage_CheckActive(this.id);
}


function LMMessage_CheckActive(id) {
	var layer= FindTagFromId(id);
	var obj= layer.lmobj;
	if (!obj.active) {
		if (obj.target == 0) window.status= obj.oldMessage;
		else if (obj.target == 1) document.title= obj.oldMessage;
	
		obj.oldMessage= "";
		obj.pos= 0;
		obj.BounceParams.message1= obj.BounceParams.Leftspace + obj.message + obj.BounceParams.Rightspace;
		obj.BounceParams.dir= "left";
	
		return true;
	}
	return false;	
}

function LMMessage_Marquee(id)
{
	var layer= FindTagFromId(id);
	var obj= layer.lmobj;
	
	SetMessage(obj.message.substring(obj.pos, obj.message.length) + " " + obj.message.substring(0,obj.pos), obj.target);
	
	obj.pos++;
	if (obj.pos > obj.message.length) obj.pos = 0;
	
	if (LMMessage_CheckActive(id)) return;
	window.setTimeout("LMMessage_Marquee(\"" + obj.id + "\")", obj.speed);
}

function LMMessage_RtlSlide(id)
{
	var layer= FindTagFromId(id);
	var obj= layer.lmobj;

	SetMessage(obj.message.substring(obj.pos, obj.message.length), obj.target);

	obj.pos++;
	if (obj.pos > obj.message.length) obj.pos = 0;

	if (LMMessage_CheckActive(id)) return;
	window.setTimeout("LMMessage_RtlSlide(\"" + obj.id + "\")", obj.speed);
}

function LMMessage_Bounce(id) {
	var layer= FindTagFromId(id);
	var obj= layer.lmobj;

	if (obj.BounceParams.dir == "left") {
		var message2 = obj.BounceParams.message1.substring(1, obj.BounceParams.message1.length) + " ";
		SetMessage(message2, obj.target);

		obj.BounceParams.message1 = message2;
		if (obj.BounceParams.message1.substring(0, 1) != " ") obj.BounceParams.dir= "right";
	}
	else {
		message2 = " " + obj.BounceParams.message1.substring(0, obj.BounceParams.message1.length - 1);
		SetMessage(message2, obj.target);

		obj.BounceParams.message1 = message2;
		if (obj.BounceParams.message1.substring(obj.BounceParams.message1.length - 1, obj.BounceParams.message1.length) != " ") obj.BounceParams.dir= "left";
	}

	if (LMMessage_CheckActive(id)) return;
	window.setTimeout("LMMessage_Bounce(\"" + obj.id + "\")", obj.speed);
}

function LMMessage_Flash(id) {
	var layer= FindTagFromId(id);
	var obj= layer.lmobj;
	
	if (obj.target == 0) {
		if (window.status == obj.message) SetMessage("", obj.target);
		else SetMessage(obj.message, obj.target);
	}
	else if (obj.target == 1) {
		if (document.title == obj.message) SetMessage("", obj.target);
		else SetMessage(obj.message, obj.target);
	}

	if (LMMessage_CheckActive(id)) return;
	window.setTimeout("LMMessage_Flash(\"" + obj.id + "\")", obj.speed);
}


function LMMessage_Typewriter(id) {
	var layer= FindTagFromId(id);
	var obj= layer.lmobj;
	
	SetMessage(obj.message.substring(0, obj.pos), obj.target);

	obj.pos++;
	if (obj.pos > obj.message.length) obj.pos= 0;

	if (LMMessage_CheckActive(id)) return;
	window.setTimeout("LMMessage_Typewriter(\"" + obj.id + "\")", obj.speed);
}

var GOffetX=0,GOffetY=0;
var GRelX=0,GRelY=0;
var GPropW=1,GPropH=1;
var gbasewidth=0,gbaseheight=0,gbaseinit=false;
var defpagewitdh=0;

function Is() {
   var agent = navigator.userAgent.toLowerCase();
   idx=navigator.userAgent.indexOf("MSIE");
   if(idx>=0) {
      var ua=navigator.userAgent;
      this.major = parseInt(ua.substring(idx+5,ua.indexOf(".",idx)));
      this.minor = parseFloat(ua.substring(idx+5,ua.indexOf(" ",idx+5)));
   }
   else {
      idx=navigator.userAgent.indexOf("Netscape/");
      if(idx>=0) {
         var ua=navigator.userAgent;
	      this.major = parseInt(ua.substring(idx+9,ua.indexOf(".",idx)));
         this.minor = parseFloat(ua.substr(idx+9,5));
      }
      else {
         this.major = parseInt(navigator.appVersion);
         this.minor = parseFloat(navigator.appVersion);
      }
   }
   this.safari  = agent.indexOf('safari')!=-1;
   this.opera  = agent.indexOf('opera')!=-1;
   this.firefox  = agent.indexOf('firefox')!=-1;
   this.netscape  = ((agent.indexOf('mozilla')!=-1) && ((agent.indexOf('spoofer')==-1) && (agent.indexOf('compatible') == -1)));
   this.explorer = (agent.indexOf("msie") != -1);
   this.ns = (this.netscape && (this.minor >= 4.03));
   this.ie3 = (navigator.userAgent.indexOf("MSIE 3.0") != -1);
   this.ie = (this.explorer && !this.ie3);
   this.macpowerpc = (navigator.userAgent.indexOf("Mac_PowerPC") != -1);

   if(this.opera) {
      this.netscape=true;
      this.ns=true;
      this.major=7;
      this.minor=7.1;
      this.explorer=false;
      this.ie=false;
   }
   if(this.firefox) {
      this.major=7;
      this.minor=7.1;
   }
}

var is = new Is();
var language;
var fontfact;
var fontbase=96.;

function isValideBrowser(minor_ns,minor_ie)
{
   if(is.explorer) {
      language=navigator.browserLanguage.toLowerCase();
   }
   else {
      language=navigator.language.toLowerCase();
   }

   return true;
}

function FindIdxInLMObjects(id)
{
   for(var i=0; i<LMObjects.length; i++) {
      if(LMObjects[i].id==id) return i;
   }
   return -1;
}

function FindTagStyleFromId(id)
{
   var tag=FindTagFromId(id);
   return tag.style;
}

function FindTagFromId(id)
{
	return document.getElementById(id);
}

function FindClassObjectFromId(id)
{
   for(var i=0; i<LMObjects.length; i++) {
      if(LMObjects[i].id==id) return LMObjects[i];
   }
   return null;
}

function FindClassObjectFromTagDiv(TagObject)
{
   if(TagObject.LMObjectsIdx==-1) {
      TagObject.LMObjectsIdx=FindIdxInLMObjects(TagObject.id);
   }
   return LMObjects[TagObject.LMObjectsIdx];
}

function IsDisplayVisble(id)
{
	var tag=$("#" + id);
	if(tag.css('display')=='none') return false;
	return true;
}

function TagIsVisible()
{
	var layershow = true;

	var LMObject=FindClassObjectFromId(this.id);
	if(LMObject.layerid) {
		var layertag=FindTagFromId(LMObject.layerid);

		var LMObjectLayer=FindClassObjectFromId(this.id);
		if(LMObjectLayer.displayenable) {
			if(IsDisplayVisble(LMObject.layerid)==false) layershow=false; 
		}
		else {
			if(layertag.style.visibility != "inherit") layershow=false;
		}
	}

	var show=false;

	if(LMObject.displayenable) {
		if(IsDisplayVisble(this.id)==true  && layershow) show=true; 
	}
	else {
		if(this.style.visibility == "inherit" && layershow) show=true;
	}

	return show;
}

function TagIsDrawingEffect()
{
   if(this.drawingeffect==1) return true;
   return false;
}

function TagShow()
{
   if(this.drawingeffect==1) return;

   var object=FindClassObjectFromId(this.id);
   if(!object) return;

   if(object.layerid) {
      var layer=FindClassObjectFromId(object.layerid);
      if(layer.visible==false) return;
   }
   object.visible=true;

   if(object.displayenable) {
	   if(this.style.display == "block") return;
	   this.style.display = "block";
   }
   else {
	   if(this.style.visibility == "inherit") return;
	   this.style.visibility = "inherit";
   }

   if(object.ShowObject) object.ShowObject(); 
}

function TagHide()
{
   if(this.drawingeffect==1) return;

   var object=FindClassObjectFromId(this.id);
   if(!object) return;

   object.visible=false;

   if(object.displayenable) {
	   if(this.style.display == "none") return;
	   this.style.display = "none";
   }
   else {
	   if(this.style.visibility == "hidden") return;
	   this.style.visibility = "hidden";
   }

   if(object.HideObject) object.HideObject(); 
}

function TagShowEffect()
{
   if(this.drawingeffect==1) return;
   var object=FindClassObjectFromId(this.id);
   if(!object) return;

   if(object.InitObject) object.InitObject();
   object.Effect();
}

function TagHideEffect()
{
   if(this.drawingeffect==1) return;

   var object=FindClassObjectFromId(this.id);
   if(!object) return;

   if(object.displayenable) {
	   this.style.display = "none";
   }
   else {
	   this.style.visibility = "hidden";
   }

   if(object.HideObject) object.HideObject(); 
}

function TagToggleVisibleState()
{
   if(this.IsVisible()) this.Hide();
   else this.Show(); 
}

function TagPlay()
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.Play) object.Play();
}

function TagStop()
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.Stop) object.Stop();
}

function TagTogglePlayState()
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.TogglePlayState) object.TogglePlayState();
}

function TagRollIn()
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.RollIn) object.RollIn();
   else if(this.Show) this.Show();
}

function TagRollOut()
{
   var object=FindClassObjectFromId(this.id);
   if(!object) return;
   if(object.RollOut) object.RollOut();
   else if(this.Hide) this.Hide();
}

function TagGetTop() 
{
   return this.offsetTop;
}

function TagSetTop(top) 
{
   var LMObject=FindClassObjectFromTagDiv(this);
   if(LMObject) LMObject.y=top;
   this.style.top=top + "px"; ;
}

function TagGetLeft() 
{
   return this.offsetLeft;
}

function TagSetLeft(left) 
{
   var LMObject=FindClassObjectFromTagDiv(this);
   if(LMObject) LMObject.x=left;
   this.style.left=left + "px";
}

function TagGetWidth() 
{
   return this.offsetWidth;
}

function TagSetWidth(width) 
{
   var LMObject=FindClassObjectFromTagDiv(this);
   if(LMObject) LMObject.w=width;
   this.style.width=width + "px"; ;
}

function TagGetHeight() 
{
   return this.offsetHeight;
}

function TagSetHeight(height) 
{
   var LMObject=FindClassObjectFromTagDiv(this);
   if(LMObject) LMObject.h=height;
   this.style.height=height + "px"; ;
}

function TagSetClip(top,right,bottom,left) 
{
   this.style.clip = "rect(" + top + "px, " + right + "px, " + bottom + "px, " + left + "px)";  
}

function PosPage(Stretch,Position,scalefx,scalefy) 
{
   if(scalefx<=0) scalefx=1;
   if(scalefy<=0) scalefy=1;

   if(window.innerWidth == undefined) {
	   wwindow=document.body.clientWidth;
	   hwindow=document.body.clientHeight;
   }
   else {
	   wwindow=window.innerWidth; 
	   hwindow=window.innerHeight;
	   if(is.major>=9) wwindow-=18;
   }

   if(gbaseinit==false) {
      var backpanel=FindTagFromId("Page");
      backpanel.SetLeft=TagSetLeft;
      backpanel.SetTop=TagSetTop;
      backpanel.SetWidth=TagSetWidth;
      backpanel.SetHeight=TagSetHeight;
      backpanel.GetLeft=TagGetLeft;
      backpanel.GetTop=TagGetTop;
      backpanel.GetWidth=TagGetWidth;
      backpanel.GetHeight=TagGetHeight;
      backpanel.oriw=backpanel.GetWidth(); 
      backpanel.orih=backpanel.GetHeight(); 

      gbasewidth=LMObjects[0].TagObject.GetWidth();   
      gbaseheight=LMObjects[0].TagObject.GetHeight();  

	  //Patch pour jQuery Accordeon
	  if(gbasewidth==0) gbasewidth=defpagewitdh;

      var tags=document.getElementsByTagName("SPAN");
      var len=tags.length;
      for(var i=0; i<len; i++) {
         fonttag=tags[i];
         fonttag.ptori=0;
         if(parseInt(fonttag.style.fontSize)==0) continue;
         if(!isNaN(fonttag.style.fontSize)) continue;
         fonttag.ptori=fonttag.style.fontSize;
      }
      gbaseinit=true;
   }

   //5 2 6
   //1 0 3
   //7 4 8

   w=gbasewidth;
   h=gbaseheight;
   var offx=0;
   var offy=0;

   switch(Position) {
      case 0:
         offx=(wwindow-w)/2.;
         offy=(hwindow-h)/2.;
         break;
      case 1:
         offx=0;
         offy=(hwindow-h)/2.;
         break;
	  case 2:
         offx=(wwindow-w)/2.;
         offy=0;
         break;
      case 3:
         offx=(wwindow-w);
         offy=(hwindow-h)/2.;
         break;
      case 4:
         offx=(wwindow-w)/2.;
         offy=(hwindow-h);
         break;
      case 5:
         offx=0;
         offy=0;
         break;
      case 6:
         offx=(wwindow-w);
         offy=0;
         break;
      case 7:
         offx=0;
         offy=(hwindow-h);
         break;
	  case 8:
         offx=(wwindow-w);
         offy=(hwindow-h);
         break;
   }
   
   var backpanel=FindTagFromId("Page");

   offy=0;
   if (offx < 0) offx= 0;
   if (offy < 0) offy= 0;

   backpanel.SetLeft(offx); 
   backpanel.SetTop(offy); 
}

function ShowProperties(obj,framed)
{
   var sProps="";
   for(props in obj) {
     sProps += props + ": "+ obj[props] + "\n";
     if(framed==0) {
        alert(sProps);
        sProps="";
     }
   }

   if(framed==1) {
      alert(sProps);
   } 
   else if(framed==2) {
      var hwnd = window.open("about:blank","debug","");
      hwnd.document.write("<PRE>\n" + sProps + "</PRE>\n");
   }
}


function HexToStr(str) 
{
   var strOut = "";
   
   var l2 = str.length/2;
   for(var x=1; x<=l2; x++) {
      var c1=HexToDec(str.charAt((x-1)*2));
      var c2=HexToDec(str.charAt((x-1)*2+1));
      var c=c1*16+c2;
      strOut = strOut + String.fromCharCode(c);
   }     
   return strOut;
}

function HexToUnicode(str) 
{
   var strOut = "";
   var s1=16;
   var s2=16*16;
   var s3=16*16*16;
   
   var l2 = str.length/4;
   for(var x=1; x<=l2; x++) {
      var c1=HexToDec(str.charAt((x-1)*4));
      var c2=HexToDec(str.charAt((x-1)*4+1));
      var c3=HexToDec(str.charAt((x-1)*4+2));
      var c4=HexToDec(str.charAt((x-1)*4+3));
      var c=c1*s3+c2*s2+c3*s1+c4;
      strOut = strOut + String.fromCharCode(c);
   }    
   return strOut;
}

function HexToDec(c)
{
var alpha="aA";

   if(c>='a' && c<='f') return c.charCodeAt(0)-alpha.charCodeAt(0)+10; 
   if(c>='A' && c<='F') return c.charCodeAt(0)-alpha.charCodeAt(1)+10;  
   else return eval(c);
}

function EnDecrypStr(sSecret) 
{
   var sSecretTodo = sSecret;
   var sPassword = "$%¢£²¼|*°«¢@%)-¾?";
   var strOut = "";
 
   var l = sPassword.length;
   var l2 = sSecretTodo.length/2;
   for(var x=1; x<=l2; x++) {
      var g=((x-1) % l);
      var iChar = sPassword.charCodeAt(g);
      var c1=HexToDec(sSecretTodo.charAt((x-1)*2));
      var c2=HexToDec(sSecretTodo.charAt((x-1)*2+1));
      var c=c1*16+c2;
      iChar = c ^ iChar;
      strOut = strOut + String.fromCharCode(iChar);
   }     
   return strOut;
}

function AuthorisationFail(pageerror)
{
   if(pageerror.length) location=pageerror; 
   else location="./lmpasswerror.html";
}

function SetPasswordCookie(login,password,timeseesion)
{
   var name=login+password;
   setCookie(name, "1", null, timeseesion);
}

function GetPasswordCookie(login,password)
{
   var name=login+password;
   if(getCookie(name)) return true;
   else return false;
}

function CompareUnicodeString(str1,str2)
{
   if(str1.length!=str2.length) { return false; }

   l=str1.length;
   for(i=0; i<l; i++) {
      if(str1.charCodeAt(i)!=str2.charCodeAt(i)) { return false; }
   }
   return true;
}

function GetDisplayInfo(loginpar,passwordpar,timeseesion,pageerror,path)
{
   login=EnDecrypStr(loginpar);
   login=HexToUnicode(login);

   password=EnDecrypStr(passwordpar);
   password=HexToUnicode(password);

   if(GetPasswordCookie(loginpar,passwordpar)) {
      SetPasswordCookie(loginpar,passwordpar,timeseesion);
      return;
   }

   str=path+"lmpasswdlg.html?l='"+loginpar+"',p='"+passwordpar+"',t="+timeseesion+",pa='"+pageerror+"',pth='"+path+"',f='"+location+"',lang='"+language+"'"; 
   location=str; 
   return;
}


var MSG_QUIT;
var preloadImages = new Array();

function InitResources()
{
   //InitResources2(language);
   InitResources2("en");
}

function InitResources2(lang)
{
   language=lang;
   if(lang=="fr" || lang=="fr-ca" || lang=="fr-fr" || lang=="fr-be" || lang=="fr-ch" || lang=="fr-lu") {
      MSG_QUIT = "Voulez-vous vraiment quitter ?";
      MSG_LINKNOTAVAILABLE = "Publiez le site pour vérifier cette fonction.";
      RES_PASSTitleStr="Entrez votre identifiant et votre mot de passe<br>";
      RES_PASSLoginStr="Identifiant :";
      RES_PASSPasswordStr="Mot de passe :";
      RES_PASSButOkStr="    Ok    ";
      RES_PASSButCancelStr="Annuler";
      RES_VALIDDIGITALPHAMAIL="Chiffres, lettres ou courriel seulement";
      RES_VALIDDIGITALPHA="Chiffres ou lettres seulement";
      RES_VALIDDIGITMAIL="Chiffres ou courriel seulement";
      RES_VALIDALPHAMAIL="Lettres ou courriel seulement";
      RES_VALIDDIGIT="Chiffres seulement";
      RES_VALIDALPHA="Lettres seulement";
      RES_VALIDMAIL="Courriel seulement";
      RES_VALIDBLANK="Le champ ne doit pas être vide";
      RES_ADDFAVORITES="Les utilisateurs de Netscape ou Firefox doivent ajouter le lien manuellement en pressant les touches <Ctrl+D>";
      RES_TIMEOUT="Ce site Web à été réalisé avec une version d'évaluation de LMSOFT Web Creator.\nPour découvrir ou acheter Web Creator allez à www.lmsoft.com";
      RES_GADGETHOME="Accueil";
      RES_GADGETBACK="Précédente";
      RES_GADGETQUIT="Quitter";
      RES_GADGETFOWARD="Suivante";
      RES_GADGETPRINT="Imprimer page courante";
      RES_GADGETADDFAVORITE="Ajouter aux favoris";
      RES_GADGETSENDTOFRIEND="Envoyer à un ami";
      RES_MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      RES_DAYS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
      RES_CAL_HEADER="\"Montrer l'archive du mois\"";
      RES_CAL_PREM="\"Mois précédent\"";
      RES_CAL_PREY="\"Année précédente\"";
      RES_CAL_NEXTM="\"Mois suivant\"";
      RES_CAL_NEXTY="\"Année suivante\"";
	  RES_NOTWORKING_IN_LOCAL="Le son fonctionnera une fois le site en ligne.";
	  RES_FLVEveAct_Local="FlashVideo Event/Action fonctionnera une fois le site en ligne.";
   }
   else if(lang=="nl" || lang=="nl-be") {
      MSG_QUIT = "Weet u zeker dat u wilt stoppen?";
      MSG_LINKNOTAVAILABLE = "Publiceer de site om deze functie te controleren.";
      RES_PASSTitleStr="Voer uw gebruikersnaam en wachtwoord in<br>";
      RES_PASSLoginStr="Gebruikersnaam:";
      RES_PASSPasswordStr="Wachtwoord&nbsp;&nbsp;:";
      RES_PASSButOkStr="     Ok     ";
      RES_PASSButCancelStr=" Annuleren ";
      RES_VALIDDIGITALPHAMAIL="Alleen cijfers, letters en e-mail zijn in het veld toegestaan";
      RES_VALIDDIGITALPHA="Alleen cijfers en letters zijn in het veld toegestaan";
      RES_VALIDDIGITMAIL="Alleen cijfers en e-mail zijn in het veld toegestaan";
      RES_VALIDALPHAMAIL="Alleen letters en e-mail zijn in het veld toegestaan";
      RES_VALIDDIGIT="Alleen cijfers zijn in het veld toegestaan";
      RES_VALIDALPHA="Alleen letters zijn in het veld toegestaan";
      RES_VALIDMAIL="Alleen e-mail is in het veld toegestaan";
      RES_VALIDBLANK="Het veld mag niet leeg zijn";
      RES_ADDFAVORITES="Firefox- en Netscape-gebruikers moeten handmatig bladwijzers naar pagina's maken door op <Ctrl+D> te drukken";
      RES_TIMEOUT="This Web page was created with an evaluation copy of LMSOFT Web Creator.\nTo discover or buy Web Creator go to www.lmsoft.com";
      RES_GADGETHOME="Start";
      RES_GADGETBACK="Terug";
      RES_GADGETQUIT="Afsluiten";
      RES_GADGETFOWARD="Vooruitspoelen";
      RES_GADGETPRINT="Huidige pagina afdrukken";
      RES_GADGETADDFAVORITE="Aan favorieten toevoegen";
      RES_GADGETSENDTOFRIEND="Naar een vriend/vriendin sturen";
      RES_MONTHS = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'];
      RES_DAYS = ["Zon","Maa","Din","Woe","Don","Vr","Zat"];
      RES_CAL_HEADER="\"Archiefmaand weergeven\"";
      RES_CAL_PREM="\"Vorige maand\"";
      RES_CAL_PREY="\"Vorig jaar\"";
      RES_CAL_NEXTM="\"Volgende maand\"";
      RES_CAL_NEXTY="\"Volgend jaar\"";
      RES_NOTWORKING_IN_LOCAL="Het geluid werkt zodra de website online is.";
	  RES_FLVEveAct_Local="FlashVideo Event/Action werkt zodra de website online is.";
   }
   else if(lang=="de") {
      MSG_QUIT = "Sind Sie sicher, dass Sie beenden möchten?";
      MSG_LINKNOTAVAILABLE = "Veröffentlichen Sie die Website, um diese Funktion zu überprüfen.";
      RES_PASSTitleStr="Geben Sie Ihren Benutzernamen und Ihr Kennwort ein<br>";
      RES_PASSLoginStr="Benutzername :";
      RES_PASSPasswordStr="Kennwort &nbsp;&nbsp;:";
      RES_PASSButOkStr="     OK     ";
      RES_PASSButCancelStr=" Abbrechen ";
      RES_VALIDDIGITALPHAMAIL="In diesem Feld sind nur Zahlen, Buchstaben und E-Mail-Adressen zulässig";
      RES_VALIDDIGITALPHA="In diesem Feld sind nur Zahlen und Buchstaben zulässig";
      RES_VALIDDIGITMAIL="In diesem Feld sind nur Zahlen und E-Mail-Adressen zulässig";
      RES_VALIDALPHAMAIL="In diesem Feld sind nur Buchstaben und E-Mail-Adressen zulässig";
      RES_VALIDDIGIT="In diesem Feld sind nur Zahlen zulässig";
      RES_VALIDALPHA="In diesem Feld sind nur Buchstaben zulässig";
      RES_VALIDMAIL="In diesem Feld sind nur E-Mail-Adressen zulässig";
      RES_VALIDBLANK="Dieses Feld muss ausgefüllt werden";
      RES_ADDFAVORITES="Benutzer von Firefox und Netscape müssen die Seiten manuell zu den Favoriten hinzufügen, indem sie die Tastenkombination <Strg+D> verwenden";
      RES_TIMEOUT="This Web page was created with an evaluation copy of LMSOFT Web Creator.\nTo discover or buy Web Creator go to www.lmsoft.com";
      RES_GADGETHOME="Startseite";
      RES_GADGETBACK="Zurück";
      RES_GADGETQUIT="Beenden";
      RES_GADGETFOWARD="Weiter";
      RES_GADGETPRINT="Aktuelle Seite drucken";
      RES_GADGETADDFAVORITE="Zu Favoriten hinzufügen";
      RES_GADGETSENDTOFRIEND="An einen Freund senden";
      RES_MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
      RES_DAYS = ["So","Mo","Di","Mi","Do","Fr","Sa"];
      RES_CAL_HEADER="\"Monatsarchiv anzeigen\"";
      RES_CAL_PREM="\"Vormonat\"";
      RES_CAL_PREY="\"Letztes Jahr\"";
      RES_CAL_NEXTM="\"Nächster Monat\"";
      RES_CAL_NEXTY="\"Nächstes Jahr\"";
      RES_NOTWORKING_IN_LOCAL="Ton funktioniert, wenn die Website online ist.";
	  RES_FLVEveAct_Local="FlashVideo Event/Action, wenn die Website online ist.";
   }
   else if(lang=="es") {
		MSG_QUIT = "¿Desea salir?";
		MSG_LINKNOTAVAILABLE = "Publique el sitio para comprobar esta función.";
		RES_PASSTitleStr="Introduzca el nombre de usuario y la contraseña<br>";
		RES_PASSLoginStr="Nombre de usuario:";
		RES_PASSPasswordStr="Contraseña&nbsp;&nbsp;:";
		RES_PASSButOkStr="     Aceptar     ";
		RES_PASSButCancelStr=" Cancelar ";
		RES_VALIDDIGITALPHAMAIL="Sólo se permiten números, letras y direcciones de correo electrónico en el campo";
		RES_VALIDDIGITALPHA="Sólo se permiten números y letras en el campo";
		RES_VALIDDIGITMAIL="Sólo se permiten números y direcciones de correo electrónico en el campo";
		RES_VALIDALPHAMAIL="Sólo se permiten letras y direcciones de correo electrónico en el campo";
		RES_VALIDDIGIT="Sólo se permiten números en el campo";
		RES_VALIDALPHA="Sólo se permiten letras en el campo";
		RES_VALIDMAIL="Sólo se permiten direcciones de correo de electrónico en el campo";
		RES_VALIDBLANK="El campo no debe estar vacío";
		RES_ADDFAVORITES="Los usuarios de Firefox y Netscape deben marcar las páginas favoritas de forma manual, con <Ctrl+D>";
		RES_TIMEOUT="Esta página web fue creada con una copia de evaluación de LMSOFT Web Creator.\nPara descubrir o adquirir Web Creator, vaya a www.lmsoft.com";
		RES_GADGETHOME="Inicio";
		RES_GADGETBACK="Atrás";
		RES_GADGETQUIT="Salir";
		RES_GADGETFOWARD="Avanzar";
		RES_GADGETPRINT="Imprimir página actual";
		RES_GADGETADDFAVORITE="Agregar a los favoritos";
		RES_GADGETSENDTOFRIEND="Enviar a un amigo";
		RES_MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Augosto','Septiembre','Octubre','Noviembre','Diciembre'];
		RES_DAYS = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];
		RES_CAL_HEADER="\"Mostrar archivo de mes\"";
		RES_CAL_PREM="\"Mes anterior\"";
		RES_CAL_PREY="\"Año anterior\"";
		RES_CAL_NEXTM="\"Mes siguiente\"";
		RES_CAL_NEXTY="\"Año siguiente\"";
		RES_NOTWORKING_IN_LOCAL="El sonido funcionará cuando su sitio es en línea.";
		RES_FLVEveAct_Local="FlashVideo Event/Action funcionará cuando su sitio es en línea.";
   }
   else if(lang=="vi") {
		MSG_QUIT = "Bạn có chắc là bạn muốn thoát?";
		MSG_LINKNOTAVAILABLE = " site để kiểm tra chức năng này.";
		RES_PASSTitleStr="Nhập Tên Người Dùng và Mật khẩu của bạn<br>";
		RES_PASSLoginStr="Tên Người Dùng :";
		RES_PASSPasswordStr="Mật khẩu&nbsp;&nbsp;:";
		RES_PASSButOkStr="     Đồng Ý    ";
		RES_PASSButCancelStr=" Hủy bỏ ";
		RES_VALIDDIGITALPHAMAIL="Chỉ có số, chữ cái và email là được phép nhập trong trường này";
		RES_VALIDDIGITALPHA="Chỉ có số và chữ cái được phép nhập trong trường này";
		RES_VALIDDIGITMAIL="Chỉ có số và email được phép nhập trong trường này";
		RES_VALIDALPHAMAIL="Chỉ có chữ cái và email được phép nhập trong trường này";
		RES_VALIDDIGIT="Chỉ có số được phép nhập trong trường này";
		RES_VALIDALPHA="Chỉ có chữ cái được phép nhập trong trường này";
		RES_VALIDMAIL="Chỉ có email được phép nhập trong trường này";
		RES_VALIDBLANK="Trường bắt buộc không được để trống";
		RES_ADDFAVORITES="Người dùng Firefox và Netscape phải dùng tay làm dấu những trang bằng cách nhấn <Ctrl+D>";
		RES_TIMEOUT="Trang Web này đã được tạo với một bản sao có định lượng (thời gian) của LMSOFT Web Creator.\n Để tìm hiểu hoặc mua Web Creator hãy đến trang www.lmsoft.com";
		RES_GADGETHOME="Trang chủ";
		RES_GADGETBACK="Quay lại";
		RES_GADGETQUIT="Thoát";
		RES_GADGETFOWARD="Tiếp tới";
		RES_GADGETPRINT="In trang hiện hành";
		RES_GADGETADDFAVORITE="Thêm vào mục Ưa Thích";
		RES_GADGETSENDTOFRIEND="Gởi đến một người bạn";
		RES_MONTHS = ['Tháng Một','Tháng Hai','Tháng Ba','Tháng Tư','Tháng Năm','Tháng Sáu','Tháng Bảy','Tháng Tám','Tháng Chín','Tháng Mười','Tháng Mười Một','Tháng Mười Hai'];
		RES_DAYS = ["Chủ nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ sáu","Thứ Bảy"];
		RES_CAL_HEADER="\"Hiện tháng lưu trữ\"";
		RES_CAL_PREM="\"Tháng liền trước\"";
		RES_CAL_PREY="\"Năm liền trước\"";
		RES_CAL_NEXTM="\"Tháng kế tiếp\"";
		RES_CAL_NEXTY="\"Năm kế tiếp\"";
		RES_NOTWORKING_IN_LOCAL="Sound will work once the website is online.";
		RES_FLVEveAct_Local="FlashVideo Event/Action will work once the website is online.";
   }
   else {
      MSG_QUIT = "Are you sure you want to quit?";
      MSG_LINKNOTAVAILABLE = "Publish the site to check this feature.";
      RES_PASSTitleStr="Enter your User Name and Password<br>";
      RES_PASSLoginStr="User Name :";
      RES_PASSPasswordStr="Password &nbsp;&nbsp;:";
      RES_PASSButOkStr="     Ok     ";
      RES_PASSButCancelStr=" Cancel ";
      RES_VALIDDIGITALPHAMAIL="Only numbers, letters and email are allowed in the field";
      RES_VALIDDIGITALPHA="Only numbers and letters are allowed in the field";
      RES_VALIDDIGITMAIL="Only numbers and email are allowed in the field";
      RES_VALIDALPHAMAIL="Only letters and email are allowed in the field";
      RES_VALIDDIGIT="Only numbers allowed in the field";
      RES_VALIDALPHA="Only letters allowed in the field";
      RES_VALIDMAIL="Only email allowed in the field";
      RES_VALIDBLANK="The field must not be blank";
      RES_ADDFAVORITES="Firefox and Netscape users must bookmark the pages manually by hitting <Ctrl+D>";
      RES_TIMEOUT="This Web page was created with an evaluation copy of LMSOFT Web Creator.\nTo discover or buy Web Creator go to www.lmsoft.com";
      RES_GADGETHOME="Home";
      RES_GADGETBACK="Back";
      RES_GADGETQUIT="Quit";
      RES_GADGETFOWARD="Forward";
      RES_GADGETPRINT="Print current page";
      RES_GADGETADDFAVORITE="Add to favorites";
      RES_GADGETSENDTOFRIEND="Send to a friend";
      RES_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      RES_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      RES_CAL_HEADER="\"Show month archive\"";
      RES_CAL_PREM="\"Previous month\"";
      RES_CAL_PREY="\"Previous year\"";
      RES_CAL_NEXTM="\"Next month\"";
      RES_CAL_NEXTY="\"Next year\"";
	  RES_NOTWORKING_IN_LOCAL="Sound will work once the website is online.";
	  RES_FLVEveAct_Local="FlashVideo Event/Action will work once the website is online.";
   }
}

function getURLParam(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}
function LMText(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branchlist,tooltip,param)
{
   var LMText = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branchlist,tooltip,param,true);

   var tagdiv=document.getElementById(id);
   tagdiv.drawok=1;
   tagdiv.onmouseup=LMGlobalUp;
   tagdiv.onmousedown=LMGlobalDn;
   tagdiv.onmouseover=TagLMTextMouseOver;
   tagdiv.onmouseout=TagLMTextMouseOut;

   LMText.GetTop=TagGetTop;
   LMText.GetWidth=TagGetWidth;
   LMText.GetHeight=TagGetHeight;
   LMText.SetLeft=TagSetLeft;
   LMText.SetTop=TagSetTop;
   LMText.SetWidth=TagSetWidth;
   LMText.SetHeight=TagSetHeight;

   LMText.oriw=LMText.GetWidth();
   LMText.orih=LMText.GetHeight();

   return LMText;
}

function LMTextBrOver(id,idx)
{
   LMGlobalOver(id); 
   FireEvent(id+"_"+idx,"_OnMouseEnter");

   var LMObject=FindClassObjectFromId(id);
   if(!LMObject) return;

   if(LMObject.BranchLst) {
      for (var i=0; i<LMObject.BranchLst.length; i++) {
         if(LMObject.BranchLst[i]==null) continue;
         if(LMObject.BranchLst[i].id == idx) {
            GadgetShowLink(LMObject.BranchLst[i]);
            break;
         }
      }
   }
}

function LMTextBrOut(id,idx)
{
   LMGlobalOver(-1); 
   FireEvent(id+"_"+idx,"_OnMouseLeave");

   var LMObject=FindClassObjectFromId(id);
   if(!LMObject) return;
   if(LMObject.BranchLst) window.status="";
}

function LMTextBrDown(id,idx)
{
   FireEvent(id+"_"+idx,"_OnMouseDown");
}

function LMTextBrUp(object_id,branch_id)
{
   FireEvent(object_id+"_"+branch_id,"_OnMouseUp");
   FireEvent(object_id+"_"+branch_id,"_OnClick");

   var LMObject=FindClassObjectFromId(object_id);
   if(!LMObject) return;
   if(!LMObject.BranchLst) return; 
   for (var i = 0; i < LMObject.BranchLst.length;i++) {
      if(LMObject.BranchLst[i]==null) continue;
      if(LMObject.BranchLst[i].id == branch_id) {
         if(LMObject.BranchLst[i].where.indexOf('GADGET')!=-1 || LMObject.BranchLst[i].openinnewwindow) LMObjectClick(LMObject.id,i); 
         break;
      }
   }
}

function TagLMTextMouseOver(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(this.id); 
}

function TagLMTextMouseOut(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(-1);  
}


//function LMTextMouseUp()
//{
//   LMObjectClick(this.id,0);
//}

var gCapturedSlide= null;

function LMGal(id,initvisible,displayenable,delais,delaisdisp,listphotos,interval,type,pathref,totalh,multipage,shownumbers,showdesc,autostart,showfrise,allowpopup,usehalves,fullpage,forceview,allowloop,allowstretch)
{
   var LMGal = new LMObject(id,initvisible,displayenable,delais,null,delaisdisp,null,null,null,null,true);

   var tagdiv=document.getElementById(id);
   tagdiv.drawok=1;

   LMGal.InitObject=LMGalInit;
   LMGal.interval=interval;
   LMGal.listphotos=listphotos;
   LMGal.currentslide=0;
   LMGal.currentmosaic=0;
   LMGal.type=type;
   LMGal.pathref=pathref+"LMGal/";
   LMGal.multipage= multipage;
   LMGal.autostart= autostart;
   LMGal.showdesc= showdesc;
   LMGal.totalh= totalh;
   LMGal.shownumbers= shownumbers;
   LMGal.showfrise= showfrise;
   
   LMGal.allowpopup= allowpopup;
   LMGal.usehalves= usehalves;
   LMGal.fullpage= fullpage;
   LMGal.forceview= forceview;
   LMGal.allowloop= allowloop;
   LMGal.allowstretch= allowstretch;

   //Pour ne pas effacer les images par le Cleaner
   var dump;
   dump="./LMGal/firstn.png";
   dump="./LMGal/firsto.png";
   dump="./LMGal/lastn.png";
   dump="./LMGal/lasto.png";
   dump="./LMGal/mbg.png";
   dump="./LMGal/mbgp.png";
   dump="./LMGal/mosn.png";
   dump="./LMGal/moso.png";
   dump="./LMGal/nextn.png";
   dump="./LMGal/nexto.png";
   dump="./LMGal/openn.png";
   dump="./LMGal/openo.png";
   dump="./LMGal/pausen.png";
   dump="./LMGal/pauseo.png";
   dump="./LMGal/playn.png";
   dump="./LMGal/playo.png";
   dump="./LMGal/prevn.png";
   dump="./LMGal/prevo.png";
   dump="./LMGal/sbg.png";

   return LMGal;
}

function LMGalInit() 
{
   if(this.init==true) return;
   this.init=true;

   if(this.type=='Slide') {
       var LMObject=FindClassObjectFromId(this.id);
       LMObject.play= this.autostart;

       FillPhotosSlide(this.id,0);
       if (this.autostart) FillPhotosSlidePlay(this.id);
   }
   else FillPhotosMosaic(this.id,0);
   
}

function GalMiniBarMouseTrap(e)
{
    if(e==null) e=window.event;
    
    var scroll= getScrollXY();
    posx = e.clientX + scroll[0];
    posy = e.clientY + scroll[1];

    var layerparent=FindTagFromId(gCapturedSlide);
    if (layerparent == null) return;
    
	var layer= FindTagFromId(gCapturedSlide + "Slide");
	if (layer == null) return;
	
	var backpanel=FindTagFromId("Page");
	if (backpanel == null) return;
	
	var oxstretch= backpanel.GetLeft();
	var oystretch= backpanel.GetTop();
		
	if (	posx >= oxstretch + layer.offsetLeft + layerparent.offsetLeft - 3 && 
			posx <= oxstretch + layer.offsetLeft + layerparent.offsetLeft + layer.offsetWidth + 2 && 
			posy >= oystretch + layer.offsetTop + layerparent.offsetTop - 3 && 
			posy <= oystretch + layer.offsetTop + layerparent.offsetTop + layer.offsetHeight + 2)
		{
		    // rien
		}
	else
	{
	    HideMinibar(gCapturedSlide,0);
	    gCapturedSlide= null;
	}
}

function Photo(thumbnail, url, imgw, imgh, title, effect)
{
   this.thumbnail=thumbnail;
   this.url=url;
   this.imgw=imgw;
   this.imgh=imgh;
   this.title=title;
   this.effect=effect;
}

function GalSetImage(tag,filename)
{
   tag.src=filename;
}

function GalSetPlayStopButton51(classid,over) {
   var LMObject=FindClassObjectFromId(classid);
   if(!LMObject) return;
  
   var pathref=LMObject.pathref;

   var but=document.getElementById(classid+"PausePlay");
   if (but == null) return;
   if(LMObject.play==0) {
      if(over) but.src=pathref+"/playo.png";
      else but.src=pathref+"/playn.png";
   }
   else {
      if (over) but.src=pathref+"/pauseo.png";
      else but.src=pathref+"/pausen.png";
   }
}

function FillPhotosSlidePause(classid)
{
   var LMObject=FindClassObjectFromId(classid);
   if(!LMObject) return;
   
   if(LMObject.timeid!=0) clearTimeout(LMObject.timeid);
   LMObject.play=0;
   GalSetPlayStopButton51(classid,0);
}

function FillPhotosSlidePlay(classid)
{
   var LMObject=FindClassObjectFromId(classid);
   if(!LMObject) return;
   if(LMObject.play==1) return;

   if(LMObject.timeid!=0) clearTimeout(LMObject.timeid);

   LMObject.play=1;
   GalSetPlayStopButton51(classid,0);

   LMObject.currentslide++;
   LMObject.timeid=setTimeout("FillPhotosSlide('"+classid+"',"+LMObject.currentslide+")",LMObject.interval);
}

function FillPhotosSlideTogglePause(classid)
{
   var LMObject=FindClassObjectFromId(classid);
   if(!LMObject) return;
   
   if(LMObject.play==1) {
       FillPhotosSlidePause(classid);
   }
   else {
       FillPhotosSlidePlay(classid);
   }
}

function FillPhotosSetInterval(classid,value)
{
   var LMObject=FindClassObjectFromId(classid);
   if(!LMObject) return;

   LMObject.interval=value;

   if(LMObject.timeid!=0) clearTimeout(LMObject.timeid);
   if(LMObject.play) LMObject.timeid=setTimeout("FillPhotosSlide('"+classid+"',"+LMObject.currentslide+")",LMObject.interval);
}

function MapNext(classid)
{
   var LMObject=FindClassObjectFromId(classid);
   if(!LMObject) return;
   FillPhotosSlide(classid, LMObject.currentslide + 1);
}

function MapPrev(classid)
{
   var LMObject=FindClassObjectFromId(classid);
   if(!LMObject) return;
   FillPhotosSlide(classid, LMObject.currentslide - 1);
}

function ShowMinibar(classid,rendu)
{
    if (rendu > 26) rendu= 26;

    if (gCapturedSlide) return;

    var tagminibar=document.getElementById(classid+"SlideControls");
    if (tagminibar.sliding && rendu == 0) return;
    tagminibar.sliding= 1;
    tagminibar.style.display= 'block';

    tagminibar.style.top=rendu-26;
    if (rendu < 26) {
        rendu= rendu + 4;
        setTimeout("ShowMinibar('"+classid+"',"+rendu+")", 25);
    }
    else {
        tagminibar.sliding= 0;
        gCapturedSlide= classid;
        
        $(document).bind('mousemove', GalMiniBarMouseTrap);
    }
}

function HideMinibar(classid,rendu)
{
    if (rendu > 26) rendu= 26;

    document.onmousemove= null;
    var tagminibar=document.getElementById(classid+"SlideControls");
    if (tagminibar == null) return;
    if (tagminibar.sliding && rendu == 0) return;
    tagminibar.sliding= 1;

    tagminibar.style.top= -rendu;
    if (rendu < 26) {
        rendu= rendu + 4;
        setTimeout("HideMinibar('"+classid+"',"+rendu+")", 25);
    }
    else {
        tagminibar.sliding= 0;
        tagminibar.style.display= 'none';
        gCapturedSlide= null;
    }
}

function ContextSwitch(classid,slide)
{
    var LMObject=FindClassObjectFromId(classid);
    if(!LMObject) return;

    var taggrid=document.getElementById(classid+"Grid");
    var taggridcontrols=document.getElementById(classid+"GridControls");
    var tagslide=document.getElementById(classid+"Slide");
    var tagslide2=document.getElementById(classid+"Slide2");
    var tagslidedesc=document.getElementById(classid+"SlideDesc");
    var tagslidefrise=document.getElementById(classid+"SlideFrise");
    
    if (slide) {
        taggrid.style.display= "none";
        taggridcontrols.style.display= "none";

        tagslide.style.display= "block";
        tagslide2.style.display= "block";

        if (LMObject.showdesc) tagslidedesc.style.display= "block";
        else tagslidedesc.style.display= "none";

        if (LMObject.showfrise) tagslidefrise.style.display= "block";
        else tagslidefrise.style.display= "none";
    }
    else {
        taggrid.style.display= "block";
        if (LMObject.multipage) taggridcontrols.style.display= "block";
        else taggridcontrols.style.display= "none";

        tagslide.style.display= "none";
        tagslide2.style.display= "none";
        tagslidedesc.style.display= "none";
        tagslidefrise.style.display= "none";
    }
}

function FillPhotosSlide(classid,start)
{
   var string="";
   var LMObject=FindClassObjectFromId(classid);
   if(!LMObject) return;
   
   if (LMObject.type != "Slide") ContextSwitch(classid,1);

   var LMPhoto=FindClassObjectFromId(classid+"Slide");
   if(LMPhoto!=null) {
	   if(LMPhoto.TagObject.drawingeffect==1) {
		   if(LMObject.play) {
			  if(LMObject.timeid!=0) clearTimeout(LMObject.timeid);
			  LMObject.timeid=setTimeout("FillPhotosSlide('"+classid+"',"+LMObject.currentslide+")",LMObject.interval);
		   }
		   return;
	   }
   }

   var pathref=LMObject.pathref;
   var listphotos=LMObject.listphotos;
   if(start>=listphotos.length) start=0; 
   if(start<0) start=listphotos.length-1;
   LMObject.currentslide=start;
   LMObject.type="Slide";

   var tagslide=document.getElementById(classid+"Slide");
   var tagfrise=document.getElementById(classid+"SlideFrise");
   //Thumbnail under galerie
   if(LMObject.showfrise) {
	  if(tagfrise.innerHTML=="") {
	      var w=tagfrise.offsetWidth-2;
	      string="<div style='position:relative;overflow:auto;width:100%;height:75px;left:0px;top:0px;'>";
	      for(i=0; i<listphotos.length; i++) {
	   	      var url_thumbnail=listphotos[i].thumbnail;
	   	      string+="<a href=javascript:FillPhotosSlide('" + classid + "',"+i+")><img src='"+ url_thumbnail + "' border=0></a>&nbsp";
	      }
	      string+="</div>";
	      tagfrise.innerHTML=string;
	  }
   }
   //~Thumbnail under galerie

   
   var title=listphotos[start].title;
   var url_img=listphotos[start].url;
   var imgw=listphotos[start].imgw;
   var imgh=listphotos[start].imgh;

   var nDestWidth=tagslide.offsetWidth;
   var nDestHeight=tagslide.offsetHeight;

   var fx = 0;
   var fy = 0;
   var fw = nDestWidth;
   var fh = nDestHeight;

   if((nDestWidth/imgw) >= (nDestHeight/imgh)) {
      fw = nDestHeight * imgw / imgh;
      fx = (nDestWidth - fw) / 2;
   }
   else {
      fh = nDestWidth * imgh / imgw;
      fy = (nDestHeight - fh) / 2;
   }
   
   if (LMObject.allowstretch) {
      fx= 0;
      fy= 0;
      fh= nDestHeight;
      fw= nDestWidth;
   }

   var tagslidecontrols=document.getElementById(classid+"SlideControls");

   string="<div style='top:0px;width:100%;'>";
   string+="<center><img src='" + pathref + "/sbg.png'></center>";
   string+="<div style='position:absolute;width:100%;top:4px;'>";

   string+="<center>";
   string+="<a href=javascript:FillPhotosSlide('" + classid + "',"+(start-1)+")><img src='"+pathref+"/prevn.png' onmouseover=GalSetImage(this,'"+pathref+"/prevo.png'); onmouseout=GalSetImage(this,'"+pathref+"/prevn.png') border=0 align=absmiddle></a>";
   string+="&nbsp";
   string+="<a href=javascript:FillPhotosSlide('" + classid + "',0)><img src='"+pathref+"/firstn.png' onmouseover=GalSetImage(this,'"+pathref+"/firsto.png'); onmouseout=GalSetImage(this,'"+pathref+"/firstn.png') border=0 align=absmiddle></a>";
   
   if (!LMObject.forceview) {
        string+="<a href=javascript:FillPhotosMosaic('" + classid + "',"+(start)+")>"+"<img src='"+pathref+"/mosn.png' onmouseover=GalSetImage(this,'"+pathref+"/moso.png'); onmouseout=GalSetImage(this,'"+pathref+"/mosn.png') border=0 align=absmiddle></a>";
   }
   else {
        //string+="<DIV style='position:static; width:1px; height:1px;'>XXXXXX</DIV>";

        string+="&nbsp";
        string+="&nbsp";
        string+="&nbsp";
        string+="&nbsp";
        string+="&nbsp";
        string+="&nbsp";
   }
   
   string+="&nbsp";
   string+="&nbsp";
   string+="<a href=javascript:FillPhotosSlideTogglePause('" + classid + "')><img id="+classid+"PausePlay src='' onmouseover=GalSetPlayStopButton51('"+classid+"',1); onmouseout=GalSetPlayStopButton51('"+classid+"',0); border=0 align=absmiddle></a>";
   string+="&nbsp";
   string+="&nbsp";
   
   if (LMObject.fullpage) {
       string+="<a href='" + url_img + "'><img src='"+pathref+"/openn.png' onmouseover=GalSetImage(this,'"+pathref+"/openo.png'); onmouseout=GalSetImage(this,'"+pathref+"/openn.png') border=0 align=absmiddle></a>";
   }
   else {
        string+="&nbsp";
        string+="&nbsp";
        string+="&nbsp";
        string+="&nbsp";
        string+="&nbsp";
        string+="&nbsp";
   }

   string+="<a href=javascript:FillPhotosSlide('" + classid + "',"+(listphotos.length-1)+")><img src='"+pathref+"/lastn.png' onmouseover=GalSetImage(this,'"+pathref+"/lasto.png'); onmouseout=GalSetImage(this,'"+pathref+"/lastn.png') border=0 align=absmiddle></a>";
   string+="&nbsp";
   string+="<a href=javascript:FillPhotosSlide('" + classid + "',"+(start+1)+")><img src='"+pathref+"/nextn.png' onmouseover=GalSetImage(this,'"+pathref+"/nexto.png'); onmouseout=GalSetImage(this,'"+pathref+"/nextn.png') border=0 align=absmiddle></a>";

   string+="</center>";
   string+="</div>"; 
   string+="</div>"; 

   tagslidecontrols.innerHTML=string;
   GalSetPlayStopButton51(classid,0);


    string="<DIV id="+classid+"CurSlide";
    if (LMObject.allowpopup) {
        string+= " onmouseover=ShowMinibar('"+classid+"',0)";
    }
    string+= " style='visibility:inherit;overflow:hidden;position:absolute;z-index:0;width:100%;height:100%;left:"+fx+"px;top:"+fy+"px;'>"; 
    //if (Boolean(window.chrome)) { // Chrome a un bogue avec la combinaison de imagemap et evenement
//        string+="<img id=" + classid + "SlideInner" + " src='" + url_img + "' border=0 WIDTH="+fw+" HEIGHT="+fh+" style='visibility:inherit'>";
    //}
    //else {
    if (LMObject.usehalves) {
        string+="<MAP name="+classid+"SlideMap onmouseover=ShowMinibar('"+classid+"',0)>";
        string+="<AREA href=javascript:MapPrev('" + classid + "'); shape='rect' coords='0,0," + fw/2 + "," + fh + "'>";
        string+="<AREA href=javascript:MapNext('" + classid + "'); shape='rect' coords='" + fw/2 + ",0," + fw + "," + fh + "'>";
        string+="</MAP>";
        
        string+="<img id=" + classid + "SlideInner" + " src='" + url_img + "' border=0 WIDTH="+fw+" HEIGHT="+fh+" style='visibility:inherit' USEMAP='#"+classid+"SlideMap'>";
    }
    else {
        string+="<img id=" + classid + "SlideInner" + " src='" + url_img + "' border=0 WIDTH="+fw+" HEIGHT="+fh+" style='visibility:inherit'>";
    }
    string+="</DIV>";
   tagslide.innerHTML=string;


    string="<DIV id="+classid+"CurSlide"+" style='visibility:inherit;overflow:hidden;position:absolute;z-index:0;width:100%;height:100%;left:"+fx+"px;top:"+fy+"px;'>"; 
    string+="<img id=" + classid + "SlideInner" + " src='" + url_img + "' border=0 WIDTH="+fw+" HEIGHT="+fh+" style='visibility:inherit'>";
    string+="</DIV>";
   tagslide.innerHTML2=string;


   if (LMObject.showdesc) {
       var tagslidedesc=document.getElementById(classid+"SlideDesc");
       tagslidedesc.innerHTML=LMGalGenerateDescription(title);
   }

   if(LMObject.play) {
      var curslide= FindTagFromId("LMImage" + classid + "Slide");
      if(LMObject.timeid!=0) clearTimeout(LMObject.timeid);
      LMObject.currentslide++;
      var doloop= true;
      if(LMObject.currentslide>=listphotos.length) {
          if (!LMObject.allowloop) doloop= false;
          LMObject.currentslide=0;
      }
      if (doloop) LMObject.timeid=setTimeout("FillPhotosSlide('"+classid+"',"+LMObject.currentslide+")",LMObject.interval);
   }

   if(LMPhoto==null) {
	   var zi = z_index;
	   LMObjects[objindex++] = LMImage(classid+"Slide",1,1,0,listphotos[start].effect,0,null,null,null,null,0);
	   z_index = zi;
	   LMPhoto=LMObjects[objindex-1];
   }
   else {
	   idx=FindIdxInLMObjects(classid+"Slide");
	   var zi = z_index;
	   LMObjects[idx] = LMImage(classid+"Slide",1,1,0,listphotos[start].effect,0,null,null,null,null,0); 
	   z_index = zi;
	   LMPhoto=LMObjects[idx]; 
   }
   LMPhoto.LMObjectGalerie=LMObject;
   LMPhoto.EffectFinishEvent=LMGALEffectFinishEvent;
   LMPhoto.InitObject();
   LMPhoto.ResizeObject=null;
   LMPhoto.TagObject.drawingeffect=1;
   LMPhoto.Effect(); 
}

function LMGalGenerateDescription(text) {
   var string= "<font face='Arial' style=\"font-size:14pt\">";
   string+= "<div align=center style=\"margin-top:3px;\">"+text+"</div>";
   string+= "</font>";
   return string;
}

function LMGALEffectFinishEvent(id)
{	
	var ImageSide=FindClassObjectFromId(id);

	var tagslide=document.getElementById(ImageSide.LMObjectGalerie.id+"Slide");
	var tagslide2=document.getElementById(ImageSide.LMObjectGalerie.id+"Slide2");
	tagslide2.innerHTML= tagslide.innerHTML2;
}

function FillPhotosMosaic(classid,start)
{
   var LMObject=FindClassObjectFromId(classid);
   if(!LMObject) return;
   
   HideMinibar(classid,0);
   ContextSwitch(classid,0);

   var LMPhoto=FindClassObjectFromId(classid+"Slide");
   if(LMPhoto!=null) {
	   if(LMPhoto.TagObject.drawingeffect==1) {
		   if(LMObject.play) {
			  if(LMObject.timeid!=0) clearTimeout(LMObject.timeid);
			  LMObject.timeid=setTimeout("FillPhotosSlide('"+classid+"',"+LMObject.currentslide+")",LMObject.interval);
		   }
		   return;
	   }
   }

   FillPhotosSlidePause(classid);

   LMObject.currentmosaic=start;
   LMObject.type="Mosaic";

   var listphotos=LMObject.listphotos;

   var pathref=LMObject.pathref;
   var string="";
   var i,j;
   var tw=100+5;
   var th=75+5;
   
   var w= $("#"+classid).width();
   var col=w/tw;
   col=parseInt(col);
   var h= $("#"+classid+"Grid").height();
   var line=(h+5)/th;
   line=parseInt(line);
   var max=col*line;
   
   if(col<=0) { alert("error col"); return; }
   if(line<=0) { alert("error line"); return; }
   if(max<=0) { alert("error max"); return; }
   
   var npages=Math.ceil(listphotos.length/max);

   if(start<0) return;
   if(start>=npages*max) return;

   var currentpage=Math.round(start/max+0.5);
   start=(currentpage-1)*max;
   
   
   var taggridcontrol=document.getElementById(classid+"GridControls");
   if (LMObject.multipage && !LMObject.shownumbers) {
       string="<div style='width:100%'>";
           string+="<center><img src='" + pathref + "/mbg.png' style='margin-top:4px;'></center>";
           string+="<div style='position:absolute;width:100%;top:4px;'>";
               string+="<center>";
                   string+="<a href=javascript:FillPhotosMosaic('" + classid + "',"+(start-max)+")><img src='"+pathref+"/prevn.png' onmouseover=GalSetImage(this,'"+pathref+"/prevo.png'); onmouseout=GalSetImage(this,'"+pathref+"/prevn.png') border=0 align=absmiddle></a>";
                   string+="<a href=javascript:FillPhotosMosaic('" + classid + "',0)><img src='"+pathref+"/firstn.png' onmouseover=GalSetImage(this,'"+pathref+"/firsto.png'); onmouseout=GalSetImage(this,'"+pathref+"/firstn.png') border=0 align=absmiddle></a>";
                   string+="&nbsp";
                   string+="<a href=javascript:FillPhotosMosaic('" + classid + "',"+(npages-1)*max+")><img src='"+pathref+"/lastn.png' onmouseover=GalSetImage(this,'"+pathref+"/lasto.png'); onmouseout=GalSetImage(this,'"+pathref+"/lastn.png') border=0 align=absmiddle></a>";
                   string+="<a href=javascript:FillPhotosMosaic('" + classid + "',"+(start+max)+")><img src='"+pathref+"/nextn.png' onmouseover=GalSetImage(this,'"+pathref+"/nexto.png'); onmouseout=GalSetImage(this,'"+pathref+"/nextn.png') border=0 align=absmiddle></a>";
               string+="</center>";
           string+="</div>";
       string+="</div>";
       taggridcontrol.innerHTML=string;
   }
   else if (LMObject.multipage && LMObject.shownumbers) {

       string="<div style='width:100%'>";
           string+="<center><img src='" + pathref + "/mbgp.png' style='margin-top:4px;'></center>";

            // Numeros de page START
           string+="<div style='position:absolute;width:100%;top:7px;'>";
           string+="<center>";
           string+="<font face='Arial' color=white style=\"font-size:10pt;\">"; 
           if(currentpage>3) string+="...&nbsp;&nbsp;&nbsp;"; 
           
           var maxnumbers=3;
           if($("#"+classid).width() > 400) maxnumbers=4;
           
           i=currentpage-3;
           if(i<0) i=0;
           for(count=0; i<npages && count<maxnumbers; i++) {
              if(count!=0) string+="&nbsp;&nbsp;&nbsp;";
              count++;
              
              if(i+1==currentpage) {
                 string+="<b>" + (i+1) + "</b>";
              }
              else {
                 string+="<a href=javascript:FillPhotosMosaic('" + classid + "',"+(i*max)+") style='color:lightgrey'>" + (i+1) + "</a>";
              }
           }
           if(i<npages) string+="&nbsp;&nbsp;&nbsp;..."; 
           
           string+="</font>"; 
           string+="</center>";
           string+="</div>";
           // Numeros de page FIN

            // Boutons START
           string+="<div style='position:absolute;left:"+(w/2-120)+"px;top:4px;'>";
           string+="<a href=javascript:FillPhotosMosaic('" + classid + "',"+(start-max)+")><img src='"+pathref+"/prevn.png' onmouseover=GalSetImage(this,'"+pathref+"/prevo.png'); onmouseout=GalSetImage(this,'"+pathref+"/prevn.png') border=0 align=absmiddle></a>";
           string+="</div>";
           string+="<div style='position:absolute;left:"+(w/2-94)+"px;top:4px;'>";
           string+="<a href=javascript:FillPhotosMosaic('" + classid + "',0)><img src='"+pathref+"/firstn.png' onmouseover=GalSetImage(this,'"+pathref+"/firsto.png'); onmouseout=GalSetImage(this,'"+pathref+"/firstn.png') border=0 align=absmiddle></a>";
           string+="</div>";
           string+="<div style='position:absolute;left:"+(w/2+68)+"px;top:4px;'>";
           string+="<a href=javascript:FillPhotosMosaic('" + classid + "',"+(npages-1)*max+")><img src='"+pathref+"/lastn.png' onmouseover=GalSetImage(this,'"+pathref+"/lasto.png'); onmouseout=GalSetImage(this,'"+pathref+"/lastn.png') border=0 align=absmiddle></a>";
           string+="</div>";
           string+="<div style='position:absolute;left:"+(w/2+94)+"px;top:4px;'>";
           string+="<a href=javascript:FillPhotosMosaic('" + classid + "',"+(start+max)+")><img src='"+pathref+"/nextn.png' onmouseover=GalSetImage(this,'"+pathref+"/nexto.png'); onmouseout=GalSetImage(this,'"+pathref+"/nextn.png') border=0 align=absmiddle></a>";
           string+="</div>";
           // Boutons FIN
       string+="</div>";

       taggridcontrol.innerHTML=string;
   }
   else {
       taggridcontrol.innerHTML="";
   }
   
   string="<div align=center>";
   var yrendu= 0;
   var xrendu= 0;
   var marge= (w - (col * 105 - 5)) / 2;
   for(j=0,i=start; i<start+max && i<listphotos.length; i++) {
      var url_thumbnail=listphotos[i].thumbnail;
      var url_img=listphotos[i].url;
      
      string+="<div style='position:absolute;width:100px;height:75px;top:"+yrendu+"px;left:"+(xrendu+marge)+"px'>";
      string+="<center>";
      string+="<a href=javascript:FillPhotosSlide('" + classid + "',"+i+")><img src='"+ url_thumbnail + "' border=0</a>";
      string+="</center>";
      string+="</div>";
      xrendu+= 105;

      var icol=i-start+1;
      if(!(icol%col)) {
         j++;
         if(j+1>line) break;
         xrendu= 0;
         yrendu+= 80;
      }
   }
   string+="</div>";
  
   var taggrid=document.getElementById(classid+"Grid");
   taggrid.innerHTML=string;
}
function XMLFileParserSync(filename,fct)
{
   try {
      if(window.ActiveXObject) {
         var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
         xmlDoc.async="false";
         ret=xmlDoc.load(filename);
         if(ret==false) {
            //alert("Error loading XML file");
            return;
         }
         fct(xmlDoc);
      }
      // code for Mozilla, Firefox, Opera, etc.
      else {
         var xmlhttp=new XMLHttpRequest();
         xmlhttp.onreadystatechange=function() {
            try {
               if (xmlhttp.readyState==4) {
                  if (xmlhttp.status==200 || xmlhttp.status==0) {
                     fct(xmlhttp.responseXML);
                  }
                  else {
                     alert("Problem retrieving XML data:" + xmlDoc.statusText);
                  }
               }
            }catch(e) {
            }
         };
         xmlhttp.open("GET",filename,true);
         xmlhttp.overrideMimeType('text/xml');
         xmlhttp.send(null);
      }
   }catch(e) {
      //alert(e);
   }
}

function XMLStringParser(string,fct)
{
   if(window.ActiveXObject) {
      var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async="false";
      xmlDoc.loadXML(string);
      fct(xmlDoc);
   }
   // code for Mozilla, Firefox, Opera, etc.
   else {
      var parser=new DOMParser();
      var xmlDoc=parser.parseFromString(string,"text/xml");
      fct(xmlDoc);
   }
}

function Blog(name,listners,path) {
   this.oxml=null;
   var curdate=new Date();
   this.name = name;
   this.year = takeYear(curdate);
   this.month = curdate.getMonth();
   this.date = 0;
   if(name) this.fct=new Function("ev","if(ev.currentTarget)"+name+".oxml=ev.currentTarget;else "+name+".oxml=ev;"+name+".Refresh();"); 
   else this.fct=null;
   this.Listners = listners;
   this.Refresh=BlogRefresh;
   this.LoadRSS=BlogLoadRSS;
   this.IsHavingPost=BlogIsHavingPost;
   this.refpath=path;

   var str="./lm_xml.png";
}

function BlogRefresh()
{
   for(var i=0; i<this.Listners.length; i++) {
      var lmblog=FindClassObjectFromId(this.Listners[i]); 
      lmblog.BlogRefresh(this);
   }
}

function BlogIsHavingPost(date)
{
   var oxml=this.oxml;
   if(oxml==null) return false;
   var oitems=oxml.getElementsByTagName("item");
   
   var string="";
   for(var i=0; i<oitems.length; i++) {
      var tdate="";
      oelem=oitems[i].getElementsByTagName("pubDate")[0];
      if(oelem) tdate=oelem.firstChild.nodeValue;
      if(tdate=="") continue;

      var ddate=new Date(tdate);
      if(ddate.getDate()==date && ddate.getMonth()==this.month && ddate.getYear()==this.year) return true;
   }

   return false;
}

function BlogLoadRSS()
{
   if(this.name==null) return;
   this.oxml=null;
   XMLFileParserSync(this.refpath+this.name+"_"+leadingZero(this.month+1)+"_"+this.year+".xml",this.fct);
}

function LMBlogViewer(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,blog,
                      bkc_item,tc_date,tc_title,tc_description,tc_comment,item_border,thumbnail_border,
                      dateFaceName,datepoinsize,datebold,dateitalic,
                      titleFaceName,titlepoinsize,titlebold,titleitalic,
                      descFaceName,descpoinsize,descbold,descitalic,
                      commentFaceName,commentpoinsize,commentbold,commentitalic,
                      textcomment,mailto,showxml,param)
{
   var LMBlogViewer = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,null,null,null,true);

   var tagdiv=document.getElementById(id);
   tagdiv.drawok=1;

   LMBlogViewer.BlogRefresh=LMBlogViewerDisplay;
   LMBlogViewer.Blog=blog;

   LMBlogViewer.textcomment=textcomment;
   LMBlogViewer.mailto=mailto;
   LMBlogViewer.bkc_item=bkc_item;
   LMBlogViewer.tc_date=tc_date;
   LMBlogViewer.tc_title=tc_title;
   LMBlogViewer.tc_description=tc_description;
   LMBlogViewer.tc_comment=tc_comment;
   LMBlogViewer.item_border=item_border;
   LMBlogViewer.thumbnail_border=thumbnail_border;
   LMBlogViewer.dateFaceName=dateFaceName;
   LMBlogViewer.datepoinsize=datepoinsize;
   LMBlogViewer.datebold=datebold;
   LMBlogViewer.dateitalic=dateitalic;
   LMBlogViewer.titleFaceName=titleFaceName;
   LMBlogViewer.titlepoinsize=titlepoinsize;
   LMBlogViewer.titlebold=titlebold;
   LMBlogViewer.titleitalic=titleitalic;
   LMBlogViewer.descFaceName=descFaceName;
   LMBlogViewer.descpoinsize=descpoinsize;
   LMBlogViewer.descbold=descbold;
   LMBlogViewer.descitalic=descitalic;
   LMBlogViewer.commentFaceName=commentFaceName;
   LMBlogViewer.commentpoinsize=commentpoinsize;
   LMBlogViewer.commentbold=commentbold;
   LMBlogViewer.commentitalic=commentitalic;
   LMBlogViewer.showxml=showxml;

   return LMBlogViewer;
}

function LMBlogViewerDisplay(blog)
{
var oelem;
var string="";

   var oxml=blog.oxml;
   if(oxml==null) {
      var tag=document.getElementById(this.id+"Inner");	
      tag.innerHTML="";
      return;
   }

   if(this.showxml) {
      string+="<a href='"+blog.refpath+blog.name+"_brss.xml'><img src='"+blog.refpath+"lm_xml.png' border=0></a><br><br>";
   }

   oitems=oxml.getElementsByTagName("item");
   for(var i=0; i<oitems.length; i++) {
      var tdate="";
      var ttitle="";
      var tdesc="";
      var tlink="";
      var tphoto="";
      var tphotoW="120";
      var tphotoH="90";
   
      oelem=oitems[i].getElementsByTagName("pubDate")[0];
      if(oelem) tdate=oelem.firstChild.nodeValue;

      if(tdate!="" && blog.date!=0 && blog.month!=0 && blog.year!=0) {
         var ddate = new Date(tdate);
         var year = takeYear(ddate);
         var month = ddate.getMonth();
         var date = ddate.getDate();
         
         if(date!=blog.date || month!=blog.month || year!=blog.year) continue;
      }

      oelem=oitems[i].getElementsByTagName("title")[0];
      if(oelem && oelem.firstChild) ttitle=oelem.firstChild.nodeValue;
      oelem=oitems[i].getElementsByTagName("description")[0];
      if(oelem && oelem.firstChild) tdesc=oelem.firstChild.nodeValue;
      oelem=oitems[i].getElementsByTagName("link")[0];
      if(oelem && oelem.firstChild) tlink=oelem.firstChild.nodeValue;
      oelem=oitems[i].getElementsByTagName("thumbnail")[0];
      if(oelem && oelem.firstChild) tphoto=oelem.firstChild.nodeValue;
      oelem=oitems[i].getElementsByTagName("thumbnailW")[0];
      if(oelem && oelem.firstChild) tphotoW=oelem.firstChild.nodeValue;
      oelem=oitems[i].getElementsByTagName("thumbnailH")[0];
      if(oelem && oelem.firstChild) tphotoH=oelem.firstChild.nodeValue;
      
   	if(tdate!="") tdate=FormatTime(tdate);

      var bkc_item="";
      var border="";
      var bold;
      var italic;

      if(this.bkc_item!="") bkc_item="background-color:"+this.bkc_item+";";
      if(this.item_border) border="border-top:"+this.item_border+"px solid #000000;border-bottom:"+this.item_border+"px solid #000000;";
      var sdivitem ="style=\""+bkc_item+border+"\"";

      var fontdate="font-family: "+this.dateFaceName+";";
      var tc_date="color:"+this.tc_date+";";
      bold="";
      if(this.datebold) bold="font-weight:bold;";
      italic="";
      if(this.dateitalic) italic="font-style:italic;";
      var sdate="style=\""+fontdate+bkc_item+tc_date+"font-size:"+this.datepoinsize+"pt;margin:0px;padding:0 0 2 0px;"+bold+italic+"\"";

      var fonttitle="font-family: "+this.titleFaceName+";";
      var tc_title="color:"+this.tc_title+";";
      bold="";
      if(this.titlebold) bold="font-weight:bold;";
      italic="";
      if(this.titleitalic) italic="font-style:italic;";
      var stitle="style=\""+fonttitle+bkc_item+tc_title+"font-size:"+this.titlepoinsize+"pt;margin:0px;padding:0 0 2 0px;"+bold+italic+"\"";

      var fontdesc="font-family: "+this.descFaceName+";";
      var tc_desc="color:"+this.tc_description+";";
      bold="";
      if(this.descbold) bold="font-weight:bold;";
      italic="";
      if(this.descitalic) italic="font-style:italic;";
      var sdesc="style=\""+fontdesc+bkc_item+tc_desc+"font-size:"+this.descpoinsize+"pt;margin:0px;padding:0 0 2 0px;"+bold+italic+"\"";

      var fontcomment="font-family: "+this.commentFaceName+";";
      var tc_comment="color:"+this.tc_comment+";";
      bold="";
      if(this.commentbold) bold="font-weight:bold;";
      italic="";
      if(this.commentitalic) italic="font-style:italic;";
      var scomment="style=\""+fontcomment+bkc_item+tc_comment+"font-size:"+this.commentpoinsize+"pt;"+bold+italic+"\"";

      var sphoto ="style=\"margin:0 0 5 0px;float:right;padding:0 5 0 0px\"";
      
      string+="<div "+sdivitem+">";
      if(tdate!="") string+="<p "+sdate+">" + tdate + "</p>";

      if(tphoto!="") {
         string+="<div "+sphoto+"><a target=blogphoto href='"+blog.refpath+tphoto+"'><img style=\"width:"+tphotoW+"px;height:"+tphotoH+"px;\" src='"+blog.refpath+tphoto+"' border="+this.thumbnail_border+"></a></div>";
      }

      if(tlink!="" && ttitle!="") string+="<p "+stitle+"><a href='"+tlink+"'>"+ ttitle +"</a></p>";
      else if(ttitle!="") string+="<p "+stitle+">"+ ttitle + "</p>";

      if(tdesc!="") {
         string+="<br><p "+sdesc+">"+ tdesc +"</p>";
      }
      else if (tphoto!="") {
         string+="<p>&nbsp;</p>";
      }

      string+="<br>";  

      if(this.textcomment!="" && this.mailto!="") {
         string+="<a "+scomment+" href='mailto:"+this.mailto+"?subject="+ttitle+"'>"+this.textcomment+"</a>";
      }

      string+="</div><br>"; 
   }


   var tag=document.getElementById(this.id+"Inner");	
   tag.innerHTML=string;
}

function FormatMonth(ddate)
{
   return RES_MONTHS[ddate.getMonth()];
}

function FormatTime(tdate)
{

   var ddate = new Date(tdate);
   var Year = takeYear(ddate);
   var Month = leadingZero(ddate.getMonth()+1);
   var MonthName = FormatMonth(ddate);
   var Day = ddate.getDate();
   var Hours = leadingZero(ddate.getHours());
   var Minutes = leadingZero(ddate.getMinutes());
   var Seconds = leadingZero(ddate.getSeconds());

   var str= Day + " " + MonthName + " " + Year + " " + Hours + ":" + Minutes + ":" + Seconds;
   return str;
}

function takeYear(theDate)
{
	x = theDate.getYear();
	var y = x % 100;
	y += (y < 38) ? 2000 : 1900;
	return y;
}

function leadingZero(nr)
{
	if (nr < 10) nr = "0" + nr;
	return nr;
}

function LMBlogCalendar(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,blog,hf_bkc,hf_tc,c_bkc,c_tc)
{
   var LMBlogCalendar = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,null,null,null,true);

   LMBlogCalendar.oxml=null;
   LMBlogCalendar.hf_bkc=hf_bkc;
   LMBlogCalendar.hf_tc=hf_tc;
	LMBlogCalendar.c_bkc=c_bkc;
   LMBlogCalendar.c_tc=c_tc;

   var tagdiv=document.getElementById(id);
   tagdiv.drawok=1;

   LMBlogCalendar.BlogRefresh=LMBlogCalendarDisplay;
   if(blog=="") {
      var listners = new Array();
      listners[0]=id; 
      LMBlogCalendar.Blog=new Blog(null,listners); 
   }
   else LMBlogCalendar.Blog=blog;

   LMBlogCalendar.BlogRefresh(null);
   return LMBlogCalendar;
}

function LMBlogBuildCalendarString(blog,day,today,id,fontf,c_bkc,c_tc)
{
   var scell ="style=\""+fontf+c_bkc+c_tc+"font-size:10px;text-align:center;width:25px;height:22px;\"";
   var stoday="style=\""+fontf+c_bkc+c_tc+"font-size:10px;text-align:center;height:22px;border: 1px solid #000000;\"";
   var slinkcell="style=\""+fontf+c_bkc+c_tc+"font-size:10px;text-align:center;font-weight:bold;text-decoration:underline;\"";
   var slinkcelltoday="style=\""+fontf+c_bkc+c_tc+"font-size:10px;text-align:center;font-weight:bold;text-decoration:underline;border: 1px solid #000000;\"";

   var string;
   if(blog && blog.IsHavingPost(day)) {
      if(day==today) string="<td "+scell+"><a "+slinkcelltoday+" href='javascript:LMBlogCalendarSetDate(\"" + id + "\"," + day + ");'>"+day+"</a></td>";
      else string="<td "+scell+"><a "+slinkcell+" href='javascript:LMBlogCalendarSetDate(\"" + id + "\"," + day + ");'>"+day+"</a></td>"; 
   }
   else {
      if(day==today) string="<td "+stoday+">"+day+"</td>";  
      else string="<td "+scell+">"+day+"</td>";
   }
   return string;
}

function LMBlogCalendarDisplay(blog)
{
var today=0;
var ddate;

   if(blog==null) {
      ddate=new Date();
   }
   else {
      ddate=new Date();
      ddate.setDate(1);
      ddate.setYear(blog.year);
      ddate.setMonth(blog.month);
   }

   var datetoday = new Date();
   if(datetoday.getYear()==ddate.getYear() && datetoday.getMonth()==ddate.getMonth()) today=datetoday.getDate(); 
   
   var datefirst = ddate;
   var year = takeYear(datefirst);
   var month = leadingZero(datefirst.getMonth()+1);
   datefirst.setDate(1);
   var daymod = datefirst.getDay();
   
   var timeA = new Date(year, month, 1);
   timeDifference = timeA - 86400000;
   var timeB = new Date(timeDifference);
   var daysInMonth = timeB.getDate();

   var fontf="font-family: verdana, arial, helvetica;";
   var hf_bkc="";
	var c_bkc="";
   if(this.hf_bkc!="") hf_bkc="background-color:"+this.hf_bkc+";";
   if(this.c_bkc!="") c_bkc="background-color:"+this.c_bkc+";";
   var hf_tc="color:"+this.hf_tc+";";
   var c_tc="color:"+this.c_tc+";";
   var border="border:solid 0px #000000;";

   var stable="style=\"height:170px;font-size:11px;"+border+"width:100%;\"";
   var sheader="style=\""+hf_bkc+";"+border+"border-bottom:0;padding:2;\"";
   var sheaderday="style=\""+c_bkc+c_tc+"font-size:10px;"+fontf+"\"";
   var sfooter="style=\""+hf_bkc+"font-weight:bold;font-size:12px;padding:2;\"";
   var stdfooter="style=\"padding:2;border-top:solid 0px #000000;\"";
   var slinkheader="style=\""+fontf+hf_tc+"text-decoration:none;text-transform:uppercase;font-weight:bold;font-size:10px;"+"\"";
   var slinkfooter="style=\""+fontf+hf_tc+"font-weight:bold;font-size:9px;text-decoration:none;\"";

   var string="";
   string+="<table "+stable+" cellspacing=0>"+
   "<caption "+sheader+"><a "+slinkheader+" href='javascript:LMBlogCalendarCurrentYearMonth(\"" + this.id + "\");' title="+RES_CAL_HEADER+">" + FormatMonth(ddate) + " " + year + "</a></caption>"+
   "<thead><tr>"+
   "<th "+sheaderday+">"+RES_DAYS[0]+"</th>"+
   "<th "+sheaderday+">"+RES_DAYS[1]+"</th>"+
   "<th "+sheaderday+">"+RES_DAYS[2]+"</th>"+
   "<th "+sheaderday+">"+RES_DAYS[3]+"</th>"+
   "<th "+sheaderday+">"+RES_DAYS[4]+"</th>"+
   "<th "+sheaderday+">"+RES_DAYS[5]+"</th>"+
   "<th "+sheaderday+">"+RES_DAYS[6]+"</th>"+
   "</tr></thead>"+
   "<tfoot "+sfooter+">"+
   "<tr>"+
   "<td colspan=3 "+stdfooter+"><a "+slinkfooter+" href='javascript:LMBlogCalendarPrevYear(\"" + this.id + "\");' title="+RES_CAL_PREY+">&lt;&lt;</a>&nbsp;&nbsp;<a "+slinkfooter+" href='javascript:LMBlogCalendarPrevMonth(\"" + this.id + "\");' title="+RES_CAL_PREM+">&lt;</a></td>"+
   "<td "+stdfooter+">&nbsp;</td>"+
   "<td colspan=3 align=right "+stdfooter+"><a "+slinkfooter+" href='javascript:LMBlogCalendarNextMonth(\"" + this.id + "\");' title="+RES_CAL_NEXTM+">&gt;</a>&nbsp;&nbsp;<a "+slinkfooter+" href='javascript:LMBlogCalendarNextYear(\"" + this.id + "\");' title="+RES_CAL_NEXTY+">&gt;&gt;</a></td>"+
   "</tr>"+
   "</tfoot>";
   
   string+="<tr>";
   day=1;
   for(var col=0; col<daymod; col++) string+="<td style=\""+c_bkc+"\">&nbsp;</td>";
   for(; col<7; col++) {
      string+=LMBlogBuildCalendarString(blog,day,today,this.id,fontf,c_bkc,c_tc);
      day++;
   }
   string+="</tr>";

   var scell ="style=\""+fontf+c_bkc+c_tc+"font-size:10px;text-align:center;width:25px;height:22px;\"";
   for(var row=1; row<6; row++) {
      string+="<tr>";
	  if(day>daysInMonth) break;
      for(var col=0; col<7; col++) {
         if(day<=daysInMonth) {
            string+=LMBlogBuildCalendarString(blog,day,today,this.id,fontf,c_bkc,c_tc);
            day++;
         }
         else {
			 string+="<td "+scell+">&nbsp;</td>";  
		 }
      }
      string+="</tr>";
   }

   string+="</table>";

   var tag=document.getElementById(this.id+"Inner");	
   tag.innerHTML=string;
}

function LMBlogCalendarSetDate(id,date)
{
   var object=FindClassObjectFromId(id); 
   if(!object) return;
   if(!object.Blog) return;

   object.Blog.date=date;

   object.Blog.LoadRSS();
   object.Blog.Refresh();
}

function LMBlogCalendarPrevMonth(id)
{
   var object=FindClassObjectFromId(id); 
   if(!object) return;
   if(!object.Blog) return;

   object.Blog.month--;
   if(object.Blog.month<0) {
      object.Blog.year--;
      object.Blog.month=11;
   }

   object.Blog.LoadRSS();
   object.Blog.Refresh();
}

function LMBlogCalendarNextMonth(id)
{
   var object=FindClassObjectFromId(id); 
   if(!object) return;
   if(!object.Blog) return;

   object.Blog.month++;
   if(object.Blog.month>11) {
      object.Blog.year++;
      object.Blog.month=0;
   }

   object.Blog.LoadRSS();
   object.Blog.Refresh();
}

function LMBlogCalendarPrevYear(id)
{
   var object=FindClassObjectFromId(id); 
   if(!object) return;
   if(!object.Blog) return;

   object.Blog.year--;
   object.Blog.LoadRSS();
   object.Blog.Refresh();
}

function LMBlogCalendarNextYear(id)
{
   var object=FindClassObjectFromId(id); 
   if(!object) return;
   if(!object.Blog) return;

   object.Blog.year++;
   object.Blog.LoadRSS();
   object.Blog.Refresh();
}
         
function LMBlogCalendarCurrentYearMonth(id)
{
   var object=FindClassObjectFromId(id); 
   if(!object) return;
   if(!object.Blog) return;

   object.Blog.date=0;
   object.Blog.Refresh();
}


function LMObjWeb(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branch,tooltip,param)
{
	var BranchLst = null;
	if (branch) {
	   BranchLst = new Array(branch);
	}

   var LMObjWeb = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,BranchLst,tooltip,param,true);

   var tagdiv=FindTagFromId(id); 
   tagdiv.drawok=1;

   return LMObjWeb;
}

function LMFlashSnd(id,initvisible,displayenable,delais,delaisdisp,branch,param,filename,loop,loop_count)
{
   var BranchLst = null;

   if (branch) {
      BranchLst = new Array(branch);
   }

   if(delaisdisp>0 && delais==0) delais=1;
   var LMFlashSound = new LMObject(id,initvisible,displayenable,delais,null,delaisdisp,null,BranchLst,null,param,true);

   LMFlashSound.InitObject=LMFlashSoundInit;
   LMFlashSound.ShowObject=LMFlashSoundShow;
   LMFlashSound.HideObject=LMFlashSoundHide;
   LMFlashSound.Play=LMFlashSoundPlay;
   LMFlashSound.Stop=LMFlashSoundStop;
   LMFlashSound.TogglePlayState=LMFlashSoundTogglePlayState;
   LMFlashSound.RollIn=LMFlashSoundRollIn;
   LMFlashSound.RollOut=LMFlashSoundRollOut;

   LMFlashSound.loop=loop;
   LMFlashSound.loop_count=loop_count;
   LMFlashSound.loop_curcount=0;
   LMFlashSound.Filename=filename;

   LMFlashSound.TagObject.Play=TagPlay;
   LMFlashSound.TagObject.Stop=TagStop;
   LMFlashSound.TagObject.TogglePlayState=TagTogglePlayState;
   LMFlashSound.TagObject.RollIn=TagRollIn;
   LMFlashSound.TagObject.RollOut=TagRollOut;

   var tagdiv=FindTagFromId(id);
   tagdiv.drawok=1;
   if(is.ie) tagdiv.style.visibility="hidden";
   else {
      tagdiv.style.visibility="inherit";
   }


   return LMFlashSound;
};

function LMFlashSoundInit()
{
   var obj=FindTagFromId(this.id);
   if(obj==null) { return; }

   if(obj.init==true) return;
   obj.init=true;

   obj.objectid=this.id;
   this.object=obj;

   var LMFlashSound=FindClassObjectFromId(this.id);
   if(LMFlashSound.visible) {
      LMFlashSound.Play();
   }
};

function playerReady(obj) {
    LMFlashSndAddListeners(obj['id']);
};

function LMFlashSndAddListeners(playerid) {
    var player= document.getElementById(playerid);
    var playlist = player.getPlaylist();
    if((playlist !== null) && (playlist !== undefined)) {
        player.addModelListener("STATE","LMFlashSoundPlayerStateChanged"); 
    }
    else {
        setTimeout("LMFlashSndAddListeners("+playerid+");", 100);
    }
};

function LMFlashSoundPlayerStateChanged(evt) {
    if (evt.newstate != 'COMPLETED') return;

    var lmid= evt['id'].substring(7);
    FireEvent(lmid, "_WhenSoundTerminate");

    var LMFlashSound=FindClassObjectFromId(lmid);
    if (!LMFlashSound) return;

    var player= document.getElementById(evt['id']);
    if (!player) return;

    LMFlashSound.loop_curcount++;

    if (LMFlashSound.BranchLst && LMFlashSound.BranchLst.length && LMFlashSound.BranchLst[0]) {
        if (!LMFlashSound.loop || (LMFlashSound.loop && LMFlashSound.loop_curcount == LMFlashSound.loop_count)) {
            LMObjectClick(lmid,0);
            return;
        }
    }

    if (LMFlashSound.loop) {	
		try {
			player.sendEvent("PLAY","true");
		}catch(e){}
    }
};

function LMFlashSoundShow()
{
   if(!this.object) return;
   this.Play();
};

function LMFlashSoundHide()
{
   if(!this.object) return;
   this.Stop();
};

function LMFlashSoundPlay()
{
    var player= document.getElementById("LMSound" + this.id);
	try {
		player.sendEvent("PLAY", "true");
	}
	catch(e) {
		alert(RES_NOTWORKING_IN_LOCAL);
	}
};

function LMFlashSoundStop()
{
    var player= document.getElementById("LMSound" + this.id);
	try {
		player.sendEvent("STOP");
	}catch(e){}
};

function LMFlashSoundTogglePlayState()
{
    if(!this.object) return;
    var player= document.getElementById("LMSound" + this.id);
    if (player.getConfig().state != "PLAYING") {
		try {
			player.sendEvent("PLAY", "true");
		}catch(e){}
    }
    else {
		try {
			player.sendEvent("STOP");
		}catch(e){}
    }
};

function LMFlashSoundRollIn()
{
    LMFlashSound=FindClassObjectFromId(this.id);
    if(!LMFlashSound) return;
    LMFlashSound.TagObject.Play();
};

function LMFlashSoundRollOut()
{
    LMFlashSound=FindClassObjectFromId(this.id);
    if(!LMFlashSound) return;
    LMFlashSound.TagObject.Stop();
};

function LMGoogleMap(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branch,tooltip,param,cursor)
{
	var BranchLst = null;
	if (branch) {
	   BranchLst = new Array(branch);
	}

   var LMGoogleMap = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,BranchLst,tooltip,param,true);

   var tagdiv=FindTagFromId(id); 
   tagdiv.drawok=1;

   var BranchLst = null;
   if (branch) {
      BranchLst = new Array(branch);
   }
   return LMGoogleMap;
}

function InitGoogleMap(divid,centerlat,centerlg,markerlat,markerlg,szoom,title) {
	var centerlatlng = new google.maps.LatLng(centerlat,centerlg);
	var markerlatlng = new google.maps.LatLng(markerlat,markerlg);
	var myOptions = {
		zoom: szoom,
		center: centerlatlng,
        mapTypeControl: true,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU }, 
        zoomControl: true,
        zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL },
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var tagdiv=document.getElementById(divid+"Inner");
	if(tagdiv==null) {
		tagdiv=document.getElementById(divid); 
		if (tagdiv==null) return;
	}

	var map = new google.maps.Map(tagdiv, myOptions);
	var marker = new google.maps.Marker({ map: map, position: markerlatlng, animation: google.maps.Animation.DROP });
	if(title!="") marker.setTitle(title); 
}

function LMDiv(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branch,tooltip,param,cursor)
{
   var BranchLst = null;
   if (branch) {
      BranchLst = new Array(branch);
   }

   var LMDiv = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,BranchLst,tooltip,param,true);

   var tagchilds=document.getElementById(id+"Childs");
   if(tagchilds) {
	   tagchilds.onmouseover=TagLMImageMouseOver;
	   tagchilds.onmouseout=TagLMImageMouseOut;
	   tagchilds.onmouseup=LMGlobalUp;
	   tagchilds.onmousedown=LMGlobalDn;
	   tagchilds.objectid=id;
   }
   
   var tagdiv=document.getElementById(id);

   if(tooltip) tagdiv.alt=tooltip;

   tagdiv.SetWidth=TagSetWidth;
   tagdiv.SetHeight=TagSetHeight;
   tagdiv.onmouseover=TagLMDivMouseOver;
   tagdiv.onmouseout=TagLMDivMouseOut;
   tagdiv.onload=new Function("TagLMDivLoad(document.getElementById('"+tagdiv.id+"'));");
   tagdiv.onmouseup=LMGlobalUp;
   tagdiv.onmousedown=LMGlobalDn;
   
   LMDiv.MouseOver=LMDivMouseOver;
   LMDiv.MouseOut=LMDivMouseOut;
   LMDiv.MouseUp=LMDivMouseUp;
   LMDiv.InitObject=LMDivInit;
   LMDiv.init=false;

   LMDiv.cursor=cursor;
   LMDiv.TagImg=tagdiv;
   tagdiv.objectid=id;
   tagdiv.onerror=TagLMDivError;
   tagdiv.drawok=1;

   return LMDiv;
}

function TagLMDivLoad(TagImg)
{
   var LMObject=FindClassObjectFromId(TagImg.objectid);
   if(!LMObject) return;
   if(LMObject.init==false) return;

   if(TagImg.complete==false) {
      setTimeout("TagLMDivLoad(FindTagFromId(\"" + TagImg.objectid + "\"))",100.);
      return;
   }

   var tagdiv=FindTagFromId(TagImg.objectid); 
   alert(tagdiv.drawok);
   tagdiv.drawok=1;
}

function TagLMDivError()
{
   var LMObject=FindClassObjectFromId(this.objectid);
   if(!LMObject) return;

   var tagdiv=FindTagFromId(this.objectid); 
   if(LMObject.init==true) {
      //alert("Image on error");
      tagdiv.drawok=1;
   }
}

function LMDivInit() 
{
   if(this.init==true) return;
   this.init=true;
}

function TagLMDivMouseOver(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(this.id); 
}

function TagLMDivMouseOut(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

   LMGlobalOver(-1);  
}

function LMDivMouseUp()
{
   LMObjectClick(this.id,0); 
}

function LMDivMouseOver()
{
   if(this.cursor) this.TagImg.style.cursor = "pointer";
   if(this.BranchLst) GadgetShowLink(this.BranchLst[0]);
}

function LMDivMouseOut()
{
   if(this.BranchLst) window.status="";
}

function LMVideoSound(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branch,tooltip,param,cursor,autostart,techno,param)
{
   var BranchLst = null;

   if (branch) {
      BranchLst = new Array(branch);
   }

   if(delaisdisp>0 && delais==0) delais=1;
   var LMVideoSound = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,BranchLst,null,param,true);

   LMVideoSound.InitObject=LMVideoSoundInit;
   LMVideoSound.ShowObject=LMVideoSoundShow;
   LMVideoSound.HideObject=LMVideoSoundHide;
   LMVideoSound.Play=LMVideoSoundPlay;
   LMVideoSound.Stop=LMVideoSoundStop;
   LMVideoSound.TogglePlayState=LMVideoSoundTogglePlayState;
   LMVideoSound.RollIn=LMVideoSoundRollIn;
   LMVideoSound.RollOut=LMVideoSoundRollOut;

   LMVideoSound.autostart=autostart;
   LMVideoSound.playing=autostart;
   LMVideoSound.techno=techno;

   LMVideoSound.TagObject.Play=TagPlay;
   LMVideoSound.TagObject.Stop=TagStop;
   LMVideoSound.TagObject.TogglePlayState=TagTogglePlayState;
   LMVideoSound.TagObject.RollIn=TagRollIn;
   LMVideoSound.TagObject.RollOut=TagRollOut;

   var tagdiv=FindTagFromId(id);
   tagdiv.drawok=1;

   return LMVideoSound;
}

function LMVideoSoundInit()
{
   var player=FindTagFromId(this.id+"Inner");
   if(player==null) { return; }

   if(player.init==true) return;
   player.init=true;

   player.objectid=this.id;
   this.object=player;
}

function LMVideoSoundShow()
{
   if(!this.object) return;
   if(IsRunningLocally()==false) if(this.autostart) this.Play();
}

function LMVideoSoundHide()
{
   if(!this.object) return;
   this.Stop();
}

function IsRunningLocally()
{
	switch(window.location.protocol) { 
	   case 'http:': 
	   case 'https:': 
		 return false;
		 break; 
	   case 'file:': 
		 return true;
		 break; 
	   default:  
		 return false;
	} 
}

function LMVideoSoundPlay()
{
   if(!this.object) return;

   switch(this.techno) {
		case "WMP":
		   this.object.controls.play();
		   break;
		case "QT":
		   this.object.Play();
		   break;
		case "VideoFlash":
		   this.object.sendEvent('PLAY','true');
		   break;
	   case "HTML5Video":
		  this.object.play();
		  break;
   }
   this.playing=true;
}

function LMVideoSoundPause()
{
	if(!this.object) return;

	switch(this.techno) {
		case "WMP":
			this.object.controls.pause();
			break;
		case "QT":
			this.object.Stop();
			break;
		case "VideoFlash":
			this.object.sendEvent('PLAY','false');
			break;
		case "HTML5Video":
		   this.object.pause();
		   break;
	}
	this.playing=false;
}

function LMVideoSoundStop()
{
	if(!this.object) return;

	switch(this.techno) {
		case "WMP":
			this.object.controls.stop();
			break;
		case "QT":
			this.object.Stop();
			this.object.Rewind(); 
			break;
		case "VideoFlash":
			this.object.sendEvent('STOP');
			break;
		case "HTML5Video":
		   this.object.pause();
		   this.object.currentTime= 0;
		   break;
	}
	this.playing=false;
}

function LMVideoSoundTogglePlayState()
{
   if(!this.object) return;
   if(this.playing==true) this.Stop();
   else this.Play(); 
}

function LMVideoSoundRollIn()
{
   LMVideoSound=FindClassObjectFromId(this.id);
   if(!LMVideoSound) return;
   LMVideoSound.TagObject.Show();
}

function LMVideoSoundRollOut()
{
   LMVideoSound=FindClassObjectFromId(this.id);
   if(!LMVideoSound) return;
   LMVideoSound.TagObject.Hide();
}

function LMTabCtl(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,branch,tooltip,param,cursor,nbtabs,initialtab)
{
    var BranchLst = null;
    if (branch) {
        BranchLst = new Array(branch);
    }

    var LMTabCtl = new LMObject(id,initvisible,displayenable,delais,effect,delaisdisp,effectdisp,BranchLst,tooltip,param,true);

    var tagdiv=document.getElementById(id);

    if(tooltip) tagdiv.text=tooltip;

    tagdiv.SetWidth=TagSetWidth;
    tagdiv.SetHeight=TagSetHeight;
    tagdiv.onmouseover=TagLMTabCtlMouseOver;
    tagdiv.onmouseout=TagLMTabCtlMouseOut;
    tagdiv.onmouseup=LMGlobalUp;
    tagdiv.onmousedown=LMGlobalDn;
    tagdiv.SetSelectedTab=LMTabCtl_SetSelectedTab;
    
    LMTabCtl.nbtabs= nbtabs;
    
    
    var i;
    for (i=1; i<=nbtabs; i++)
    {
        var tabid= id + "_tab" + i;
        var divtab= document.getElementById(tabid);

        divtab.isactive= false;
        divtab.onclick= LMTabCtl_tabClick;
        divtab.onmouseover=tabMouseOver;
        divtab.onmouseout=tabMouseOut;
        divtab.tabctl= LMTabCtl;
        divtab.idx= i;
    }    
    
    LMTabCtl.MouseUp=LMTabCtlMouseUp;
    LMTabCtl.MouseDn=LMTabCtlMouseDn;
    LMTabCtl.MouseOver=LMTabCtlMouseOver;
    LMTabCtl.MouseOut=LMTabCtlMouseOut;
    LMTabCtl.InitObject=LMTabCtlInit;
    LMTabCtl.init=false;
    LMTabCtl.SetSelectedTab=LMTabCtl_SetSelectedTab;

    LMTabCtl.cursor=cursor;

    LMTabCtl.TagDiv=tagdiv;

    LMTabCtl.SetSelectedTab(initialtab);
    
    var divtab= document.getElementById(id + "_tab" + initialtab);
    var atab= divtab.parentNode;
    
    var frame= document.getElementById(id + "_iframe");
    frame.src= atab.href;

    return LMTabCtl;
}

function LMTabCtl_tabClick()
{
    this.tabctl.SetSelectedTab(this.idx);
}

function tabMouseOver(e)
{
    if (this.isactive) return;

	if(e==null) var e=window.event;
	e.cancelBubble = true;
	
	this.className= this.id + "_active";
}

function tabMouseOut(e)
{
    if (this.isactive) return;

	if(e==null) var e=window.event;
	e.cancelBubble = true;

    this.className= "";
}

function LMTabCtl_SetSelectedTab(idx)
{
    var i;
    for (i=1; i<=this.nbtabs; i++)
    {
        var tabid= this.id + "_tab" + i;
        var divtab= document.getElementById(tabid);

        if (idx == i) {
            divtab.isactive= true;
            divtab.className= divtab.id + "_active";
        }
        else {
            divtab.isactive= false;
            divtab.className= "";
        }
    }
}

function LMTabCtlInit()
{
    if(this.init==true) return;
    this.init=true;

    tagdiv=document.getElementById(this.id);
    tagdiv.drawok=1;
}

function TagLMTabCtlMouseOver(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(this.id); 
}

function TagLMTabCtlMouseOut(e)
{
	if(e==null) var e=window.event;
	e.cancelBubble = true;

	LMGlobalOver(-1);  
}

function LMTabCtlMouseUp()
{
      FireEvent(this.id,"_WhenButtonUp");
      LMObjectClick(this.id,0); 
}

function LMTabCtlMouseDn()
{
      FireEvent(this.id,"_WhenButtonDown");
}

function LMTabCtlMouseOver()
{
}

function LMTabCtlMouseOut()
{
}function SetBaseColor(r,g,b){}