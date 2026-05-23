import Hero from '../components/Hero';
import About from '../components/About';
import Members from '../components/Members';
import Highlights from '../components/Highlights';
import Games from '../components/Games';
import Community from '../components/Community';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Members limit={18} showViewAll={true} />
      <Highlights />
      <Games />
      <Community />
    </>
  );
}
