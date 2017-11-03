/*
 * Copyright 2016-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Author - Pratik Kelwalkar
 *
 */
import {Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
 selector: 'amexio-video-player',
 template: `
   <div id='player'>
     <video id='video-element' #videoRef (timeupdate)="onTimeUpdate()" (volumechange)="updateMuteUI()">
       <source [attr.src]="path">
     </video>
     <div id='controls'>
       <progress id='progress-bar' min='0' max='100' value='0' #progressbar>0% played</progress>
       <button id='btnReplay' style="vertical-align: middle" class='replay' title='replay' accesskey="R" (click)='replayVideo();'>Replay</button>
       <button id='btnPlayPause' [ngClass]="{'play' : !isPlaying, 'pause' : isPlaying}" style="vertical-align: middle" (click)="onPlay()">Play</button>
       <button id='btnStop' class='stop' style="vertical-align: middle" (click)="resetPlayer()">Stop</button>
       <input type="range" id="volume-bar"  min="0" max="1" step="0.1" value="1" (input)="onVolumeChange($event)" #volumebar>
       <button id='btnMute' (click)="onMute()" [ngClass]="{'mute' : !isMuted,'unmute' : isMuted}" title='mute' style="vertical-align: middle">Mute</button>
       <button id='btnFullScreen' class='fullscreen' title='toggle full screen' accesskey="T" style="vertical-align: top" (click)="onFullScreen()">[&nbsp;&nbsp;]</button>
     </div>
   </div>
   <div style="clear:both"></div>
 `,
  styles : [`
    body {
      font-family: Verdana, Geneva, sans-serif;
    back    body {
      font-family: Verdana, Geneva, sans-serif;
      background-color: lightgray;
    }

    p { font-size: 0.9em; }

    h1 {
      font-size:16px;
      color:#333;
    }

    #player {
      float:left;
      padding:1em 1em .5em;
      border-radius: 9px;
    }

    #controls {
      width: 420px;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      margin-top: 10px;
      padding-bottom: 1px;
      border-radius: 7px;
    }

    video {
      border:1px solid darkgreen;
      width:420px;
      height:231px;
    }

    button {
      text-indent:-9999px;
      width:16px;
      height:16px;
      border:none;
      cursor:pointer;
      background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAQCAYAAAAWNJ1eAAAAB3RJTUUH4AMQDS0aGLmsqwAAAAlwSFlzAAAOdAAADnQBaySz1gAAAvZJREFUeNrtmk2u0zAQxyele7gBZcOWcAJ8AKTXFVvKhnW5QbhBD4BEe4GnvgULdkaCNeUE5N2gbJGgeDJ26rhO4rFbKRX5P7mtP+YX2x1PHPdl4ErCa/W6UEmc1ACsVekGQjWyeKwrVWYN+bF63aqU99jsVJqryblvbTGyeKxrkoSPesxC/f3CosyaEBzso0DUvgL5JmZk8VhdoihXKLsnLLtLsYix1jkcf+VIU12wZUwI6LZo89xTN7J4rFOZLxxgxrjG+Vm0WNB27hlvXrWQICb6Im5IXqhU9lwi17Zuh13WS2juF/Dzq0TWW+tzLMvuj2ip47J480W8G5V+qnSwStfg+9KxDbW98V6Bw+qThGdA0WYBPQtmohu507rRYQ/ryg77RU8e9Vmlb1b+q0q3iawPqn+fEllmrF+qlDbGUDVtyRkwQs0YjFll4zpSHMsvikASyHnwVlwALbSV1aq+nU2gfRWGOJPoyaNw33VwyqYDYIXqkqwV0x5vK7sWWy6rSwUcHQgd5b1ebO+AIlvtQNh4GoSkx9RN5P0Vr/HbKTsw7P0sWT9ZxrBET5lMZNnqYs2Yvb7TNF/E4bGkM2/CelInZ0WtVPkPp90bZfvQOBAqzInS9MdTFutE52H5bl92mUxk2eKwhiOzB/L33nIgVJgTpT0tZE7+AcQ70XlY9ioU9TFHXJ9i7UglcOaU9j2FZRvPEidzyR33C9BONoGutYLOg7v99h2+7Mn79Bf8X3w4S9T26ayQ6boca8m0tw83l4msLu31u+hoY+r26ERrz1D7nMdo3ZNHPQWKGEa5LotnySrcThNZobocC/c4tP8oGYwS6AT87gysNm31+1I/6jdFZcZptyaUfwf+2cdOdfz08Gxk8VhNLm1Y3e1DzK0nhdU8kceotIJjFBVADmTq8omumMMxhIVoD8cdvKuRxWMdZTas4ed0l2HRzzNC9xudpQByIgmnj//34w+wQ2ANVf6fPfZ63IUZU+YxHOa/SfwPrCvVP/2nY6KBhDUMAAAAAElFTkSuQmCC') no-repeat 0 0; /* url('buttons.png') */
    }

    .pause { background-position:-19px 0; }
    .stop { background-position:-38px 0; }

    #volume-bar {
      width: 50px;
      vertical-align: middle;
      padding:0px;
    }
    .mute { background-position:-95px 0; }
    .unmute { background-position:-114px 0; }
    .replay { background-position:-133px 0;
      vertical-align: middle;
    }
    .fullscreen {
      text-indent: 0px;
      color: #00c600;
      background-color: black;
      background-image: none;
      padding: 0px;
      font-weight: bold;
      padding-bottom: 3px;
    }


    progress {
      color: green;
      font-size: 12px;
      width: 220px;
      height: 16px;
      border: none;
      margin-right: 10px;
      background: #434343;
      border-radius: 9px;
      vertical-align: middle;
    }
    progress::-moz-progress-bar {
      color:green;
      background:#434343;
    }

    progress[value]::-webkit-progress-bar {
      background-color: #434343;
      border-radius: 2px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    }

    progress[value]::-webkit-progress-value {
      background-color: green;
    }

    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      margin: 6.8px 0;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4.4px;
      cursor: pointer;
      box-shadow: 0.9px 0.9px 1.7px #002200, 0px 0px 0.9px #003c00;
      background: #205928;
      border-radius: 1px;
      border: 1.1px solid #18d501;
    }
    input[type=range]::-webkit-slider-thumb {
      box-shadow: 2.6px 2.6px 3.7px #00aa00, 0px 0px 2.6px #00c300;
      border: 2.5px solid #83e584;
      height: 18px;
      width: 9px;
      border-radius: 3px;
      background: #439643;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -7.9px;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #276c30;
    }
    input[type=range]::-moz-range-track {
      width: 100%;
      height: 4.4px;
      cursor: pointer;
      box-shadow: 0.9px 0.9px 1.7px #002200, 0px 0px 0.9px #003c00;
      background: #205928;
      border-radius: 1px;
      border: 1.1px solid #18d501;
    }
    input[type=range]::-moz-range-thumb {
      box-shadow: 2.6px 2.6px 3.7px #00aa00, 0px 0px 2.6px #00c300;
      border: 2.5px solid #83e584;
      height: 18px;
      width: 9px;
      border-radius: 3px;
      background: #439643;
      cursor: pointer;
    }
    input[type=range]::-ms-track {
      width: 100%;
      height: 4.4px;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    input[type=range]::-ms-fill-lower {
      background: #194620;
      border: 1.1px solid #18d501;
      border-radius: 2px;
      box-shadow: 0.9px 0.9px 1.7px #002200, 0px 0px 0.9px #003c00;
    }
    input[type=range]::-ms-fill-upper {
      background: #205928;
      border: 1.1px solid #18d501;
      border-radius: 2px;
      box-shadow: 0.9px 0.9px 1.7px #002200, 0px 0px 0.9px #003c00;
    }
    input[type=range]::-ms-thumb {
      box-shadow: 2.6px 2.6px 3.7px #00aa00, 0px 0px 2.6px #00c300;
      border: 2.5px solid #83e584;
      height: 18px;
      width: 9px;
      border-radius: 3px;
      background: #439643;
      cursor: pointer;
      height: 4.4px;
    }
    input[type=range]:focus::-ms-fill-lower {
      background: #205928;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #276c30;
    }ground-color: lightgray;
    }

    p { font-size: 0.9em; }

    h1 {
      font-size:16px;
      color:#333;
    }

    #player {
      float:left;
      padding:1em 1em .5em;
      border:2px solid darkgreen;
      border-radius: 9px;
    }

    #controls {
      border: 1px solid darkgreen;
      width: 420px;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      margin-top: 5px;
      padding-bottom: 3px;
      border-radius: 7px;
    }

    video {
      border:1px solid darkgreen;
      width:420px;
      height:231px;
      background:black;
    }

    button {
      text-indent:-9999px;
      width:16px;
      height:16px;
      border:none;
      cursor:pointer;
      background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAQCAYAAAAWNJ1eAAAAB3RJTUUH4AMQDS0aGLmsqwAAAAlwSFlzAAAOdAAADnQBaySz1gAAAvZJREFUeNrtmk2u0zAQxyele7gBZcOWcAJ8AKTXFVvKhnW5QbhBD4BEe4GnvgULdkaCNeUE5N2gbJGgeDJ26rhO4rFbKRX5P7mtP+YX2x1PHPdl4ErCa/W6UEmc1ACsVekGQjWyeKwrVWYN+bF63aqU99jsVJqryblvbTGyeKxrkoSPesxC/f3CosyaEBzso0DUvgL5JmZk8VhdoihXKLsnLLtLsYix1jkcf+VIU12wZUwI6LZo89xTN7J4rFOZLxxgxrjG+Vm0WNB27hlvXrWQICb6Im5IXqhU9lwi17Zuh13WS2juF/Dzq0TWW+tzLMvuj2ip47J480W8G5V+qnSwStfg+9KxDbW98V6Bw+qThGdA0WYBPQtmohu507rRYQ/ryg77RU8e9Vmlb1b+q0q3iawPqn+fEllmrF+qlDbGUDVtyRkwQs0YjFll4zpSHMsvikASyHnwVlwALbSV1aq+nU2gfRWGOJPoyaNw33VwyqYDYIXqkqwV0x5vK7sWWy6rSwUcHQgd5b1ebO+AIlvtQNh4GoSkx9RN5P0Vr/HbKTsw7P0sWT9ZxrBET5lMZNnqYs2Yvb7TNF/E4bGkM2/CelInZ0WtVPkPp90bZfvQOBAqzInS9MdTFutE52H5bl92mUxk2eKwhiOzB/L33nIgVJgTpT0tZE7+AcQ70XlY9ioU9TFHXJ9i7UglcOaU9j2FZRvPEidzyR33C9BONoGutYLOg7v99h2+7Mn79Bf8X3w4S9T26ayQ6boca8m0tw83l4msLu31u+hoY+r26ERrz1D7nMdo3ZNHPQWKGEa5LotnySrcThNZobocC/c4tP8oGYwS6AT87gysNm31+1I/6jdFZcZptyaUfwf+2cdOdfz08Gxk8VhNLm1Y3e1DzK0nhdU8kceotIJjFBVADmTq8omumMMxhIVoD8cdvKuRxWMdZTas4ed0l2HRzzNC9xudpQByIgmnj//34w+wQ2ANVf6fPfZ63IUZU+YxHOa/SfwPrCvVP/2nY6KBhDUMAAAAAElFTkSuQmCC') no-repeat 0 0; /* url('buttons.png') */
    }

    .pause { background-position:-19px 0; }
    .stop { background-position:-38px 0; }

    #volume-bar {
      width: 50px;
      vertical-align: middle;
      padding:0px;
    }
    .mute { background-position:-95px 0; }
    .unmute { background-position:-114px 0; }
    .replay { background-position:-133px 0; }
    .fullscreen {
      text-indent: 0px;
      color: #00c600;
      background-image: none;
      padding: 0px;
      font-weight: bold;
      padding-bottom: 3px;
    }


    progress {
      color: green;
      font-size: 12px;
      width: 220px;
      height: 16px;
      border: none;
      margin-right: 10px;
      background: #434343;
      border-radius: 9px;
      vertical-align: middle;
    }
    progress::-moz-progress-bar {
      color:green;
      background:#434343;
    }

    progress[value]::-webkit-progress-bar {
      background-color: #434343;
      border-radius: 2px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    }

    progress[value]::-webkit-progress-value {
      background-color: green;
    }

    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      margin: 6.8px 0;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4.4px;
      cursor: pointer;
      box-shadow: 0.9px 0.9px 1.7px #002200, 0px 0px 0.9px #003c00;
      background: #205928;
      border-radius: 1px;
      border: 1.1px solid #18d501;
    }
    input[type=range]::-webkit-slider-thumb {
      box-shadow: 2.6px 2.6px 3.7px #00aa00, 0px 0px 2.6px #00c300;
      border: 2.5px solid #83e584;
      height: 18px;
      width: 9px;
      border-radius: 3px;
      background: #439643;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -7.9px;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #276c30;
    }
    input[type=range]::-moz-range-track {
      width: 100%;
      height: 4.4px;
      cursor: pointer;
      box-shadow: 0.9px 0.9px 1.7px #002200, 0px 0px 0.9px #003c00;
      background: #205928;
      border-radius: 1px;
      border: 1.1px solid #18d501;
    }
    input[type=range]::-moz-range-thumb {
      box-shadow: 2.6px 2.6px 3.7px #00aa00, 0px 0px 2.6px #00c300;
      border: 2.5px solid #83e584;
      height: 18px;
      width: 9px;
      border-radius: 3px;
      background: #439643;
      cursor: pointer;
    }
    input[type=range]::-ms-track {
      width: 100%;
      height: 4.4px;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    input[type=range]::-ms-fill-lower {
      background: #194620;
      border: 1.1px solid #18d501;
      border-radius: 2px;
      box-shadow: 0.9px 0.9px 1.7px #002200, 0px 0px 0.9px #003c00;
    }
    input[type=range]::-ms-fill-upper {
      background: #205928;
      border: 1.1px solid #18d501;
      border-radius: 2px;
      box-shadow: 0.9px 0.9px 1.7px #002200, 0px 0px 0.9px #003c00;
    }
    input[type=range]::-ms-thumb {
      box-shadow: 2.6px 2.6px 3.7px #00aa00, 0px 0px 2.6px #00c300;
      border: 2.5px solid #83e584;
      height: 18px;
      width: 9px;
      border-radius: 3px;
      background: #439643;
      cursor: pointer;
      height: 4.4px;
    }
    input[type=range]:focus::-ms-fill-lower {
      background: #205928;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #276c30;
    }

  `]
})

export class AmexioVideoPlayerComponent implements OnInit {

 @Input()   path : any;

 @Input()   extension : any;

 @ViewChild('videoRef')   videoPlayer : any;

 @ViewChild('progressbar')  progressBar : any;

 @ViewChild('volumebar')  volumebar : any;

 isPlaying : boolean;

 isMuted : boolean;

 currentVolume : number = 1;

 constructor() { }

 ngOnInit() { }

 onVolumeChange(event : any){
  this.videoPlayer.nativeElement.volume = this.currentVolume =event.target.value;
 }

 updateMuteUI(){
   if(this.videoPlayer.nativeElement.muted)
     this.isMuted = true;
   else
     this.isMuted = false;
 }

 onPlay(){
   if(!this.isPlaying){
     this.videoPlayer.nativeElement.play();
     this.isPlaying = true;
   }
   else {
     this.videoPlayer.nativeElement.pause();
     this.isPlaying = false;
   }
 }

  onTimeUpdate(){
    let percentage = Math.floor((100 / this.videoPlayer.nativeElement.duration) * this.videoPlayer.nativeElement.currentTime);
    this.progressBar.nativeElement.value = percentage;
    // Update the progress bar's text (for browsers that don't support the progress element)
    this.progressBar.nativeElement.innerHTML = percentage + '% played';
    if(percentage == 100){
      this.isPlaying = false;
    }
  }

  replayVideo(){
    this.resetPlayer();
    this.onPlay();
  }

  resetPlayer(){
    this.videoPlayer.nativeElement.pause();
    this.progressBar.nativeElement.value = 0;
    this.videoPlayer.nativeElement.currentTime = 0;
    this.isPlaying = false;
  }

  onFullScreen(){
    let elem = this.videoPlayer.nativeElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

  onMute(){
    if(!this.isMuted){
      this.videoPlayer.nativeElement.muted = true;
      this.isMuted = true;
      this.volumebar.nativeElement.value = 0;
    }
    else{
      this.videoPlayer.nativeElement.muted = false;
      this.isMuted = false;
      this.volumebar.nativeElement.value = this.currentVolume;
    }
  }

}
