import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <div className="Navbar">
            <Link to="/">Splits   </Link>
            <Link to="/graphs">Graphs</Link>
        </div>
    )
}