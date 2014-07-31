//polyfills
Array.prototype.forEach=function forEach(f,r){
	var a,l,i;
	a=this;
	if(a===null||a===void 0){
		throw new Error("Array.prototype.forEach called in null or undefined.");
	}
	if(r===null&&r===void 0){
		r=null;
	}else if(typeof r!=="object"){
		r=Object(r);
	}
	for(i=0,l=a.length>>>0;i<l;i++){
		if(i in a){
			f.call(r,a[i],i,a);
		}
	}
};
//objects
var fso=WScript.CreateObject("Scripting.FileSystemObject");
var wsh=WScript.CreateObject("WScript.Shell");
var console=(function(){
	function Console(){
		
	}
	function log(s){
		WScript.Echo(s);
	}
	function info(s){
		WScript.Echo("info: "+s);
	}
	function warn(s){
		WScript.Echo("warning: "+s);
	}
	Console.prototype.log=log;
	Console.prototype.info=info;
	Console.prototype.warn=warn;
	return new Console();
}());
//utils
function ensurePath(s){
	if(s[0]==="\""){
		return s;
	}
	return "\""+s+"\"";
}
function getCommandPath(){
	return wsh.SpecialFolders("AppData")+"\\Microsoft\\Windows\\Command Shortcuts";
}
//apis
function sendShortcutTo(file,folder){
	var fileName=file.Name;
	if(fileName.toLowerCase()===".lnk"){
		console.info("Creating shortcut "+ensurePath(getCommandPath()+"\\"+fileName));
		fso.CopyFile(fileName,getCommandPath()+"\\",true);
		return;
	}else{
		fileName=file.Name.replace(/\.[^\.]+$/,".lnk");
	}
	var linkPath=folder.Path+"\\"+fileName;
	console.info("Creating shortcut "+ensurePath(linkPath));
	var link = wsh.CreateShortcut(linkPath);
	link.TargetPath = file.Path;
	link.WindowStyle = 1;
	//link.Hotkey = "";
	//link.IconLocation = "";
	//link.Description = "";
	link.WorkingDirectory = file.ParentFolder.Path;
	link.Save();
	console.info("Shortcut "+ensurePath(linkPath)+" was created.");
}
/**
 * main
 * @param String file like "C:\Program Files\Foo\bar.exe"
 * @param String type in ["shortcut","junction","symbol","hard"]
 **/
function main(args){
	if(!args.length){return;}
	var filePath=args[0],linkType=args[1];
	var linkPath,file,folder;
	if(!fso.FileExists(args[0])){
		console.log("warning: File "+ensurePath(filePath)+" not exists");
		return;
	}else{
		file=fso.GetFile(filePath);
	}
	linkPath=getCommandPath();
	if(!fso.FolderExists(linkPath)){
		console.log("createfolder: "+linkPath);
		folder=fso.CreateFolder(linkPath);
	}else{
		folder=fso.GetFolder(linkPath);
	}
	switch(linkType){
		case "shortcut":
		default:
			sendShortcutTo(file,folder);
			break;
	}
}
//boot
(function(){
	var args=[];
	for(var Arguments = WScript.Arguments,l=Arguments.Count(),i=0;i<l;i++){
		args.push(Arguments(i));
	}
	main.call(this,args);
}());