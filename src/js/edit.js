import { useState, useEffect } from "@wordpress/element"
import { TextControl, Button } from "@wordpress/components"
import { InspectorControls, BlockControls } from "@wordpress/block-editor"
import { ToolbarGroup, ToolbarButton } from "@wordpress/components"

const Edit = (props) => {
  const { attributes, setAttributes } = props
  const [isEditing, setIsEditing] = useState(!attributes.url)
  const [url, setUrl] = useState(attributes.url || "")
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUrlChange = (newUrl) => {
    setAttributes({ url: newUrl })
    setUrl(newUrl)
  }

  const handleDoneClick = () => {
    setIsEditing(false)
    fetchPosts(url)
  }

  const fetchPosts = async (apiUrl) => {
    if (!apiUrl) return
    setIsLoading(true)
    try {
      const response = await fetch(`${apiUrl}/wp-json/wp/v2/posts`)
      const postsData = await response.json()

      // Fetch featured media details
      const postsWithMedia = await Promise.all(
        postsData.map(async (post) => {
          const mediaResponse = await fetch(
            `${apiUrl}/wp-json/wp/v2/media/${post.featured_media}`
          )
          const mediaData = await mediaResponse.json()
          return {
            ...post,
            featured_media_url: mediaData.source_url,
          }
        })
      )

      setPosts(postsWithMedia)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (url) {
      fetchPosts(url)
    }
  }, [url])

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
        <div className="slideshow-editor">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div className="slide" key={post.id}>
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={post.featured_media_url}
                    alt={post.title.rendered}
                  />
                  <h3>{post.title.rendered}</h3>
                  <p>{post.date}</p>
                </a>
              </div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Edit
