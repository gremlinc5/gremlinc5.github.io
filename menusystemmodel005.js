function menusystemmodel005Show(mnuname) {
	x=0;y=0;
	z_index++;
	var MenuSystemItems = null;
	var miindex= 0;
	var preventopti;
	var index= z_index;

	MenuSystemItems = new Array();
	miindex=0;
	MenuSystemItems[miindex++] = new LMMenuItemStruct(mnuname + "_MenuItem1",0,0,100,30,0,0,null,0,null,new LMBranchEx("0",projectroot+"index.html",null,0.0,null,null,1,1,1,1,1,1,0,640,480,"_self"),null,null,projectroot+"menusystemmodel005/menusystemitem0.png",projectroot+"menusystemmodel005/menusystemitem0_over.png",null, "cursor:inherit;position:absolute;left:32px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "cursor:inherit;position:absolute;left:32px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "Home");
	preventopti = "./menusystemmodel005/menusystemitem0.png";
	preventopti = "./menusystemmodel005/menusystemitem0_over.png";
	MenuSystemItems[miindex++] = new LMMenuItemStruct(mnuname + "_MenuItem2",100,0,100,30,0,0,null,0,null,new LMBranchEx("0",projectroot+"projects.html",null,0.0,null,null,1,1,1,1,1,1,0,640,480,"_self"),null,null,projectroot+"menusystemmodel005/menusystemitem1.png",projectroot+"menusystemmodel005/menusystemitem1_over.png",null, "cursor:inherit;position:absolute;left:24px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "cursor:inherit;position:absolute;left:24px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "Projects");
	preventopti = "./menusystemmodel005/menusystemitem1.png";
	preventopti = "./menusystemmodel005/menusystemitem1_over.png";
	MenuSystemItems[miindex++] = new LMMenuItemStruct(mnuname + "_MenuItem3",200,0,100,30,0,0,null,0,null,null,null,null,projectroot+"menusystemmodel005/menusystemitem2.png",projectroot+"menusystemmodel005/menusystemitem2_over.png",null, "cursor:inherit;position:absolute;left:28px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "cursor:inherit;position:absolute;left:28px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "Gallery");
	preventopti = "./menusystemmodel005/menusystemitem2.png";
	preventopti = "./menusystemmodel005/menusystemitem2_over.png";
	MenuSystemItems[miindex++] = new LMMenuItemStruct(mnuname + "_MenuItem4",300,0,100,30,0,0,null,0,null,null,null,null,projectroot+"menusystemmodel005/menusystemitem3.png",projectroot+"menusystemmodel005/menusystemitem3_over.png",null, "cursor:inherit;position:absolute;left:32px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "cursor:inherit;position:absolute;left:32px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "Video");
	preventopti = "./menusystemmodel005/menusystemitem3.png";
	preventopti = "./menusystemmodel005/menusystemitem3_over.png";
	MenuSystemItems[miindex++] = new LMMenuItemStruct(mnuname + "_MenuItem5",400,0,100,30,0,0,null,0,null,null,null,null,projectroot+"menusystemmodel005/menusystemitem4.png",projectroot+"menusystemmodel005/menusystemitem4_over.png",null, "cursor:inherit;position:absolute;left:36px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "cursor:inherit;position:absolute;left:36px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "Blog");
	preventopti = "./menusystemmodel005/menusystemitem4.png";
	preventopti = "./menusystemmodel005/menusystemitem4_over.png";
	MenuSystemItems[miindex++] = new LMMenuItemStruct(mnuname + "_MenuItem6",500,0,100,30,0,0,null,0,null,null,null,null,projectroot+"menusystemmodel005/menusystemitem5.png",projectroot+"menusystemmodel005/menusystemitem5_over.png",null, "cursor:inherit;position:absolute;left:27px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "cursor:inherit;position:absolute;left:27px;top:8px;font-weight:0;font-family:Verdana;font-size:9pt;color:rgb(255,255,255);;margin:0px;padding:0px;line-height:100%;", "Donate");
	preventopti = "./menusystemmodel005/menusystemitem5.png";
	preventopti = "./menusystemmodel005/menusystemitem5_over.png";
	var MenuSystemModel005_MNU1 = new LMMenu(mnuname, mnuname,x+0,y+0,600,30,1,0,null,0,null,MenuSystemItems,1);
	LMObjects[objindex++]= MenuSystemModel005_MNU1;

	AddAnchorTagToObject(mnuname);
	RegisterMainMenu(MenuSystemModel005_MNU1);

	ReIndexMenu(MenuSystemModel005_MNU1, index);

}
