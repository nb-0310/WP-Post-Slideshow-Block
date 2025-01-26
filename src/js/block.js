import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

// Register the block
registerBlockType( 'post-slideshow/slideshow-block', {
    title: 'Slideshow Block',
    icon: 'images-alt',
    category: 'widgets',

    edit,

    save: () => {
        return null; // Dynamic block, save not needed
    },
} );
