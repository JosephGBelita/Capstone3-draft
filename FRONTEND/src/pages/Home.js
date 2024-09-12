import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import FeaturedCourses from '../components/FeaturedCourses';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

export default function Home() {

  const data = {
    title: "The Zuitt Shop",
    content: "Opportunities for everyone, everywhere",
    destination: "/courses", // Updated destination to /courses
    buttonLabel: "Browse Products" // Keeping button label as "Browse Products"
  };

  return (
    <>
      {/* Centered Banner */}
      <Container className="text-center mt-5">
        <h1>{data.title}</h1>
        <p className="fst-italic">{data.content}</p>
        <Button as={Link} to={data.destination} variant="primary" className="mt-4" size="lg">
          {data.buttonLabel}
        </Button>
      </Container>

      {/* Featured Courses and Highlights sections */}
      <Highlights />
      
    </>
  );
}
