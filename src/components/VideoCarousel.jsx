import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VideoCarousel() {

  const [carouselItems, setCarouselItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_ENDPOINT = 'http://127.0.0.1:8000/api/resources/slides/';

    axios.get(API_ENDPOINT)
      .then(response => {
        // Ensure data is treated as an array, even if the API returns null/undefined
        setCarouselItems(response.data || []); 
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Failed to load data");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="container-fluid my-5">Loading carousel data...</div>;
  }

  if (error) {
    return <div className="container-fluid my-5 text-danger">Error: {error}</div>;
  }

  // Determine if we need to show the controls and map the items.
  const hasItems = carouselItems.length > 0;
  
  // Define the Fallback Content
  const FallbackSlide = (
      <div 
          className="carousel-item active d-flex justify-content-center align-items-center"
          style={{ height: "350px", backgroundColor: "#e9ecef" }} // Light gray background
      >
          <h4 className="text-muted">No images available for the carousel.</h4>
      </div>
  );

  return (
    <div className="container-fluid my-5 px-0 bg-secondary">
      <div id="videoCarousel" className="carousel slide" data-bs-ride={hasItems ? "carousel" : ""}>
        
        <div className="carousel-inner">
          {hasItems ? (
            // Render actual images if available
            carouselItems.map((item, index) => (
              <div
                key={item.id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={item.url}
                  className="d-block w-100"
                  alt={item.title}
                  style={{ height: "350px", objectFit: "cover" }}
                />
              </div>
            ))
          ) : (
            // Render the fallback slide if no images are available
            FallbackSlide
          )}
        </div>

        {/* Prev / Next controls are only shown if there is more than one item */}
        {hasItems && carouselItems.length > 1 && (
          <>
            <button className="carousel-control-prev" type="button" data-bs-target="#videoCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#videoCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VideoCarousel;