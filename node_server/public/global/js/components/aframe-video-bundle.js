//The video bundle is a bundle that can show a video in:
// - Flat 
// - Spheric
// - Stereographic
//representation and makes use of a video controll element
class VideoElement{
	constructor(position){

		this.video_element = document.createElement("a-entity");
		this.video_element.setAttribute("id","VideoElement");
		this.SetVisiblity(false);

		//Set the position to the position of the body
		this.SetPosition(position);

		//0=flat 1=spheric 2=stereographic spheric
	    this.mode = 1;
	    this.hassrc = false;
	}

	GetElement(){
		return this.video_element;
	}

	//Toggle the mode in which to watch the video
	ToggleMode(){
		this.mode = (this.mode + 1)%3;

        if(this.mode == 0)
          flatvid.setAttribute("visible", true);
        else
          flatvid.setAttribute("visible", false);

        if(this.mode == 1)
          this.sphericalvid.setAttribute("visible", true);
        else
          this.sphericalvid.setAttribute("visible", false);

        if(this.mode == 2){
          this.lefteye.setAttribute("visible", true);
          this.righteye.setAttribute("visible", true);
        }else{
          this.lefteye.setAttribute("visible", false);
          this.righteye.setAttribute("visible", false);
        }
	}

	//Removes all elements
	Reset(){
		this.video_element.removeChild(this.flatvid);
		this.video_element.removeChild(this.sphericalvid);
		this.video_element.removeChild(this.lefteye);
		this.video_element.removeChild(this.righteye);
		this.video_element.removeChild(this.vidcontrol);
	}

	//Makes new elements and gives them the right source
	SetScource(source){
		//If there already is a source, delete the old elements
		if(this.hassrc){
			document.getElementById(this.flatvid.getAttribute("src").substr(1)).pause();
			this.Reset();
		}

		//Create the flat video element
		this.flatvid = document.createElement("a-video");
		this.flatvid.setAttribute("id","flatvid");
		this.flatvid.setAttribute("width","16");
		this.flatvid.setAttribute("height","9");
		this.flatvid.setAttribute("visible","false");
		this.flatvid.setAttribute("position","0 0 -10");
		this.flatvid.setAttribute("src","#"+source);
		this.video_element.appendChild(this.flatvid);

		//Create the spheric video element
		this.sphericalvid = document.createElement("a-videosphere");
		this.sphericalvid.setAttribute("id","sphericalvid");
		this.sphericalvid.setAttribute("radius","80");
		this.sphericalvid.setAttribute("rotation","0 -90 0");
		this.sphericalvid.setAttribute("src","#"+source);
		this.video_element.appendChild(this.sphericalvid);

		//Create the left eye element for the stereographic video element
		this.lefteye = document.createElement("a-entity");
		this.lefteye.setAttribute("id","lefteye");
		this.lefteye.setAttribute("geometry","primitive: sphere; radius: 80; segmentsWidth: 64; segmentsHeight: 64;");
		this.lefteye.setAttribute("material","shader:flat; src:#"+source+";");
		this.lefteye.setAttribute("scale","-1 1 1");
		this.lefteye.setAttribute("stereo","eye:left; split: vertical;");
		this.lefteye.setAttribute("visible","false");
		this.video_element.appendChild(this.lefteye);

		//Create the right eye element for the stereographic video element
		this.righteye = document.createElement("a-entity");
		this.righteye.setAttribute("id","righteye");
		this.righteye.setAttribute("geometry","primitive: sphere; radius: 80; segmentsWidth: 64; segmentsHeight: 64;");
		this.righteye.setAttribute("material","shader:flat; src:#"+source+";");
		this.righteye.setAttribute("scale","-1 1 1");
		this.righteye.setAttribute("stereo","eye:right; split: vertical;");
		this.righteye.setAttribute("visible","false");
		this.video_element.appendChild(this.righteye);

		//Create the video controls
		this.vidcontrol = document.createElement("a-entity");
		this.vidcontrol.setAttribute("id","vidcontrol");
		this.vidcontrol.setAttribute("class","clickable");
		this.vidcontrol.setAttribute("video-controls","src:#"+source);

		//Create a home button to add to the video controlls
		var home_button = document.createElement("a-image");
		home_button.setAttribute("src","icon/home.png");
		home_button.setAttribute("height","0.25");
		home_button.setAttribute("width","0.25");
		//home_button.onclick = function(){dom2aframe.showVideoPlayer();};
		home_button.setAttribute("position", {x:0.7, y:0, z:0});
		this.vidcontrol.appendChild(home_button);

		//Create a mode toggle to add to the video controlls
		var mode_toggle = document.createElement("a-image");
		mode_toggle.setAttribute("src","icon/mode-toggle.png");
		mode_toggle.setAttribute("height","0.15");
		mode_toggle.setAttribute("width","0.3");
		mode_toggle.onclick = (function(){this.ToggleMode();}).bind(this);
		mode_toggle.setAttribute("position", {x:0, y:-0.225, z:0});
		this.vidcontrol.appendChild(mode_toggle);

		this.video_element.appendChild(this.vidcontrol);

	    this.hassrc = true;
	}

	SetPosition(position){
		this.video_element.setAttribute("position", position);
	}

	SetVisiblity(bool){
      	this.video_element.setAttribute("visible", bool);
      	if(!this.IsVisible() && this.hassrc)
      		document.getElementById(this.flatvid.getAttribute("src").substr(1)).pause();
	}

	IsVisible(){
		return this.video_element.getAttribute("visible");
	}
}