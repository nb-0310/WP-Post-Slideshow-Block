import { useState, useEffect, useRef } from "@wordpress/element";
import { TextControl, Button, ToggleControl } from "@wordpress/components";
import { InspectorControls, BlockControls } from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton } from "@wordpress/components";
import '../css/index.css';

const Edit = (props) => {
  const { attributes, setAttributes } = props;
  const [isEditing, setIsEditing] = useState(!attributes.url);
  const [url, setUrl] = useState(attributes.url || "");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(true);
  const [showExcerpt, setShowExcerpt] = useState(false);

  const sliderRef = useRef();

  const handleUrlChange = (newUrl) => {
    setAttributes({ url: newUrl });
    setUrl(newUrl);
  };

  const handleDoneClick = () => {
    setIsEditing(false);
    fetchPosts(url);
  };

  const fetchPosts = async (apiUrl) => {
    if (!apiUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/posts`);
      const postsData = await response.json();

      // Fetch featured media details
      const postsWithMedia = await Promise.all(
        postsData.map(async (post) => {
          const mediaResponse = await fetch(
            `${apiUrl}/wp-json/wp/v2/media/${post.featured_media}`
          );
          const mediaData = await mediaResponse.json();
          return {
            ...post,
            featured_media_url: mediaData.source_url,
          };
        })
      );

      setPosts(postsWithMedia);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchPosts(url);
    }
  }, [url]);

  const goToNext = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(posts.length - 1);
    }
  };

  return (
    <div>
      {/* Block Controls (Toolbar Button for Editing URL) */}
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon="edit"
            label="Edit URL"
            onClick={() => setIsEditing(true)}
          />
        </ToolbarGroup>
      </BlockControls>

      {/* Inspector Controls (for URL input) */}
      <InspectorControls>
        <TextControl
          label="API URL"
          value={url}
          onChange={(newUrl) => setUrl(newUrl)}
        />
        <Button onClick={() => fetchPosts(url)} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load Slideshow"}
        </Button>
        <ToggleControl
          label="Show Title"
          checked={showTitle}
          onChange={() => setShowTitle(!showTitle)}
        />
        <ToggleControl
          label="Show Excerpt"
          checked={showExcerpt}
          onChange={() => setShowExcerpt(!showExcerpt)}
        />
      </InspectorControls>

      {/* Editor Content */}
      {isEditing ? (
        <div>
          <TextControl
            label="Enter URL"
            value={url}
            onChange={handleUrlChange}
          />
          <Button isPrimary onClick={handleDoneClick}>
            Done
          </Button>
        </div>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="slider-container">
          {posts.length > 0 ? (
            <div className="slider" ref={sliderRef}>
              <div className="slides">
                {posts.map((post, index) => (
                  <div
                    className={`slide ${index === currentIndex ? "active" : ""}`}
                    key={post.id}
                  >
                    <a href={post.link} target="_blank" rel="noopener noreferrer">
                      <div
                        className="slide-image"
                        style={{
                          backgroundImage: `url(${post.featured_media_url})`,
                        }}
                      />
                      {showTitle && <h3>{post.title.rendered}</h3>}
                      {showExcerpt && <p>{post.excerpt.rendered}</p>}
                    </a>
                  </div>
                ))}
              </div>
              <div className="controls">
                <button onClick={goToPrev} className="prev-btn">
                  Prev
                </button>
                <button onClick={goToNext} className="next-btn">
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Edit;
