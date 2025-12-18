import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Carousel() {
  const navigate = useNavigate();
  const [carouselItems, setCarouselItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reliable fallback items with specific category paths
  const publicFallbackItems = [
    {
      id: 'fallback-1',
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
      title: 'Master the Art of Coding',
      description: 'Explore 160+ professional courses in Web Development and Software Engineering.',
      path: '/courses?category=Web%20Development'
    },
    {
      id: 'fallback-2',
      url: 'https://images.unsplash.com/photo-1551288049-bbda38a669a6?q=80&w=1400&auto=format&fit=crop',
      title: 'Data Science & Analytics',
      description: 'Transform raw data into actionable insights using Python and AI.',
      path: '/courses?category=Data%20Science'
    },
    {
      id: 'fallback-3',
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&auto=format&fit=crop',
      title: 'Cybersecurity Excellence',
      description: 'Protect digital assets with industry-leading security frameworks.',
      path: '/courses?category=Cybersecurity'
    }
  ];

  useEffect(() => {
    // const API_ENDPOINT = 'http://127.0.0.1:8000/api/resources/slides/';
    
    const fetchSlides = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_ENDPOINT);
        if (response.data && response.data.length > 0) {
          setCarouselItems(response.data);
        } else {
          setCarouselItems(publicFallbackItems);
        }
      // } catch (err) {
      //   setCarouselItems(publicFallbackItems);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlides();
  }, []);

  if (isLoading) {
    return (
      <div className="container-fluid px-0 mb-5 px-md-4">
        <div className="skeleton-container overflow-hidden rounded-4 shadow-sm" style={{ height: "450px" }}>
          <div className="skeleton w-100 h-100"></div>
        </div>
      </div>
    );
  }

  const itemsToRender = carouselItems.length > 0 ? carouselItems : publicFallbackItems;

  return (
    <div className="container-fluid px-0 mb-5 px-md-4">
      <style>{`
        @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
        .skeleton {
            background: #f6f7f8;
            background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
            background-repeat: no-repeat;
            background-size: 800px 450px;
            animation: shimmer 1.2s linear infinite forwards;
        }
        .carousel-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
            z-index: 1;
        }
        .carousel-caption { 
            z-index: 2; 
            bottom: 4rem; 
            text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .max-w-600 { max-width: 600px; }
        #videoCarousel, .carousel-inner, .carousel-item { 
            border-radius: 24px !important; 
        }
        .carousel-item img {
            transition: transform 0.8s ease;
        }
        .carousel-item.active img {
            transform: scale(1.05);
        }
      `}</style>

      <div className="shadow-lg border-0">
        <div id="videoCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          
          <div className="carousel-indicators">
            {itemsToRender.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#videoCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
              ></button>
            ))}
          </div>

          <div className="carousel-inner">
            {itemsToRender.map((item, index) => (
              <div key={item.id || index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <div className="carousel-overlay"></div> 
                <img
                  src={item.url}
                  className="d-block w-100"
                  alt={item.title}
                  style={{ height: "450px", objectFit: "cover", objectPosition: "center" }}
                />
                <div className="carousel-caption d-none d-md-block text-start px-4">
                  <h1 className="fw-bold display-4 mb-2 text-white">{item.title}</h1>
                  {item.description && <p className="fs-5 text-white-50 max-w-600 mb-4">{item.description}</p>}
                  
                  <button 
                    className="btn btn-primary btn-lg rounded-pill px-5 py-2 fw-bold shadow transition-all"
                    onClick={() => navigate(item.path || '/courses')}
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#videoCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true" style={{ width: '3rem', height: '3rem' }}></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#videoCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true" style={{ width: '3rem', height: '3rem' }}></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carousel;