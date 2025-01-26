import ReactDOM from 'react-dom';

const Slideshow = () => {
    return (
        <div>
            Hello from the Frontend!
        </div>
    );
};

const dynamicSlideshowBlock = () => {
    const block = document.getElementById( 'post-slideshow-block' );
    if ( block ) {
        ReactDOM.render( <Slideshow url="https://wptavern.com/wp-json/wp/v2/posts" />, block );
    }
};

document.addEventListener( 'DOMContentLoaded', dynamicSlideshowBlock );
