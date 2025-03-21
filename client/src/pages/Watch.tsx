import { Link, useParams } from "react-router";

const Watch = () => {
  const { id } = useParams();

  return (
    <div>
      <Link to="/">Home</Link>
      <p>Video id: {id}</p>
    </div>
  );
};

export default Watch;
