// Script for registering the slideshow block

import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

const CustomIcon = () => (
	<svg
	  fill="#ff057e"
	  viewBox="0 0 32 32"
	  id="icon"
	  xmlns="http://www.w3.org/2000/svg"
	  stroke="#ff057e"
	>
	  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
	  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
	  <g id="SVGRepo_iconCarrier">
		<title>carousel--horizontal</title>
		<path d="M22,26H10a2,2,0,0,1-2-2V8a2,2,0,0,1,2-2H22a2,2,0,0,1,2,2V24A2,2,0,0,1,22,26ZM10,8V24H22V8Z"></path>
		<path d="M4,24H0V22H4V10H0V8H4a2,2,0,0,1,2,2V22A2,2,0,0,1,4,24Z"></path>
		<path d="M32,24H28a2,2,0,0,1-2-2V10a2,2,0,0,1,2-2h4v2H28V22h4Z"></path>
		<rect id="Transparent_Rectangle" width="32" height="32" fill="none"></rect>
	  </g>
	</svg>
  );

// Register the block
registerBlockType('post-slideshow/slideshow-block', {
	apiVersion: 3,
	title: 'Post Slideshow',
	icon: 'slides',
	category: 'post-slideshow',

	attributes: {
		url: {
			type: 'string',
			default: '',
		},
		showTitle: {
			type: 'boolean',
			default: true,
		},
		showExcerpt: {
			type: 'boolean',
			default: true,
		},
		itemsInView: {
			type: 'number',
			default: 1,
		},
		showCategories: { 
			type: 'boolean', 
			default: true,
		},
		showTags: { 
			type: 'boolean', 
			default: true,
		},
		showAuthor: { 
			type: 'boolean', 
			default: true,
		},
		autoPlay: {
			type: 'boolean',
			default: true,
		},
	},

	example: {
		attributes: {
			url: 'https://rtcamp.com/',
			showTitle: true,
			showExcerpt: true,
			showAuthor: false,
			showTags: false,
			showCategories: false,
			itemsInView: 1,
			autoPlay: false,
		}
	},

	edit,

	save: () => {
		return null;
	},
});
