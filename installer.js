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
function sysVar(name){
	return "HKLM\\Environment\\"+name;
}
function userVar(name){
	return "HKCU\\Environment\\"+name;
}
function getCommandPath(){
	return wsh.SpecialFolders("AppData")+"\\Microsoft\\Windows\\Command Shortcuts";
}
function getReceiverPath(){
	return wsh.SpecialFolders("AppData")+"\\Microsoft\\Windows\\SendTo\\"+"命令快捷方式.lnk";
}
function getCScriptPath(){
	return wsh.Environment("Process").Item("SystemRoot")+"\\System32\\cscript.exe";
}
function getCMDPath(){
	return wsh.Environment("Process").Item("SystemRoot")+"\\System32\\cmd.exe";
}
var appFileName="sendToShortcuts.js";
//install
function install(){
	createCommandFolder();
	copyFilesToCommandFolder();
	addEnvVars();
	createReceiver();
}
function createCommandFolder(){
	var linkPath=getCommandPath();
	if(fso.FolderExists(linkPath)){
		return fso.GetFolder(linkPath);
	}else{
		console.info("Creating folder "+ensurePath(linkPath));
		return fso.CreateFolder(linkPath);
	}
}
function copyFilesToCommandFolder(){
	console.log("copyfile: "+appFileName+" to "+getCommandPath());
	fso.CopyFile(appFileName,getCommandPath()+"\\",true);
}
function addEnvVars(){
	var linkPath=getCommandPath();
	var linkVar="";
	try{linkVar=wsh.RegRead(userVar("LinkPath"));}catch(e){}
	if(!linkVar){
		console.log("regwrite: "+userVar("LinkPath"));
		wsh.RegWrite(userVar("LinkPath"),linkPath);
	}
	var path="";
	try{path=wsh.RegRead(userVar("Path"));}catch(e){}
	if(path===""||path.indexOf(linkPath)===-1){
		path=path===""?linkPath:path+";"+linkPath;
		console.log("regwrite: "+userVar("Path"));
		wsh.RegWrite(userVar("Path"),path);
	}
}
function createReceiver(){
	var cscriptPath=getCScriptPath();
	var linkPath=getReceiverPath();
	console.info("Creating shortcut "+ensurePath(linkPath));
	var link=wsh.CreateShortcut(linkPath);
	link.TargetPath=cscriptPath;
	link.Arguments=appFileName;
	link.WindowStyle=1;
	//link.Hotkey="";
	link.IconLocation=getCMDPath()+",0";
	link.Description="将程序发送到命令快捷方式之后，即可用命令运行程序";
	link.WorkingDirectory=getCommandPath();
	link.Save();
}

//uninstall
function uninstall(){
	removeEnvVars();
	removeReceiver();
	removeAppFilesInCommandFolder();
}
function removeEnvVars(){
	var linkPath=getCommandPath();
	if(wsh.RegRead(userVar("LinkPath"))){
		console.log("regdelete: "+userVar("LinkPath"));
		wsh.RegDelete(userVar("LinkPath"));
	}
	var path=wsh.RegRead(userVar("Path"))||"";
	var dirs=[];
	path.split(";").forEach(function(dir){
		if(dir===linkPath){
		}else if(dir){
			dirs.push(dir);
		}
	});
	var newPath=dirs.join(";");
	if(path!==newPath){
		console.info("regwrite: "+userVar("Path"));
		wsh.RegWrite(userVar("Path"),newPath);
	}
}
function removeReceiver(){
	var receiverPath=getReceiverPath();
	if(fso.FileExists(receiverPath)){
		console.info("deletefile: "+ensurePath(receiverPath));
		fso.DeleteFile(receiverPath);
	}
}
function removeAppFilesInCommandFolder(){
	var appPath=getCommandPath()+"\\"+appFileName;
	if(fso.FileExists(appPath)){
		console.log("deletefile: "+ensurePath(appPath));
		fso.DeleteFile(appPath);
	}
}
//main
function main(args){
	var todo=args[0];
	switch(todo){
		case "install":
			install();
			break;
		case "uninstall":
			uninstall();
			break;
	}
}
//boot
(function(){
	var args=[];
	for(var Arguments=WScript.Arguments,l=Arguments.Count(),i=0;i<l;i++){
		args.push(Arguments(i));
	}
	main.call(this,args);
}());