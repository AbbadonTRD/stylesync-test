import { useState, useEffect } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Google Reviews API endpoint (you'll need to set this up)
const GOOGLE_REVIEWS_API = 'https://maps.googleapis.com/maps/api/place/details/json';
const PLACE_ID = 'ChIJ_yvS5buJmkcRPzgkPHPTkw8'; // Your Google Place ID

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  images?: string[];
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // In a real implementation, this would be an API call to your backend
        // which would then make the Google Places API request
        const response = await fetch(`/api/reviews?placeId=${PLACE_ID}`);
        const data = await response.json();
        
        setReviews(data.reviews);
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();

    // Set up real-time updates
    const interval = setInterval(fetchReviews, 300000); // Check for new reviews every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-5 w-5 fill-primary text-primary"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-5 w-5 fill-primary text-primary"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="h-5 w-5 text-muted-foreground"
        />
      );
    }

    return stars;
  };

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Kundenbewertungen</h2>
      
      <Card>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{stats.average.toFixed(1)}</span>
              <span className="text-muted-foreground">von 5</span>
            </div>
            <div className="flex">{renderStars(stats.average)}</div>
            <p className="text-sm text-muted-foreground">
              Basierend auf {stats.total} Google Bewertungen
            </p>
          </div>

          <div className="space-y-2">
            {Object.entries(stats.distribution)
              .reverse()
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="w-12 text-sm">{rating} Sterne</span>
                  <Progress
                    value={(count / stats.total) * 100}
                    className="h-2"
                  />
                  <span className="w-12 text-sm text-muted-foreground">
                    {count}
                  </span>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-center">
            <a 
              href="https://www.google.com/maps/place/Meliyah+afro-shop/@47.5572101,8.891765,17z/data=!3m1!4b1!4m6!3m5!1s0x479a93bb8e5d2bbf:0xfb933de73c24e39f!8m2!3d47.5572101!4d8.8943399!16s%2Fg%2F11rvbtklvv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Alle Google Bewertungen ansehen
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {review.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{review.author}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{review.text}</p>
              {review.images && review.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="rounded-md object-cover aspect-square"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}