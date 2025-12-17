import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Carousel() {
  const [carouselItems, setCarouselItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_ENDPOINT = 'http://127.0.0.1:8000/api/resources/slides/';
    axios.get(API_ENDPOINT)
      .then(response => {
        setCarouselItems(response.data || []); 
        setIsLoading(false);
      })
      .catch(err => {
        setError("Failed to load carousel");
        setIsLoading(false);
      });
  }, []);

  // Skeleton Loader to prevent layout shift
  if (isLoading) {
    return (
      <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: "350px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const hasItems = carouselItems.length > 0;

  return (
    <div className="px-0 shadow-sm overflow-hidden">
      <div id="videoCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        
        {/* Indicators (Dots at the bottom) */}
        {hasItems && carouselItems.length > 1 && (
          <div className="carousel-indicators">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#videoCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
              ></button>
            ))}
          </div>
        )}

        <div className="carousel-inner">
          {hasItems ? (
            carouselItems.map((item, index) => (
              <div key={item.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                {/* Overlay for better text contrast if you add titles */}
                <div className="carousel-overlay"></div> 
                <img
                  src={item.url}
                  className="d-block w-100"
                  alt={item.title}
                  style={{ 
                    height: "400px", 
                    objectFit: "cover", 
                    objectPosition: "center" 
                  }}
                />
                {item.title && (
                  <div className="carousel-caption d-none d-md-block">
                    <h2 className="fw-bold">{item.title}</h2>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="carousel-item active d-flex justify-content-center align-items-center bg-light text-muted" style={{ height: "400px" }}>
              <h4>No images available.</h4>
            </div>
          )}
        </div>

        {hasItems && carouselItems.length > 1 && (
          <>
            <button className="carousel-control-prev" type="button" data-bs-target="#videoCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon shadow-sm" aria-hidden="true" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '20px' }}></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#videoCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon shadow-sm" aria-hidden="true" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '20px' }}></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Carousel;