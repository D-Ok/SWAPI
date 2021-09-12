import propTypes from "prop-types";
import "./Loader.css"

const Loader = (props) => {
    const isActive = props.isActive;
    if(!isActive)
        return <></>;

    return <div className={"modal-background"}>
            <div className="lds-default">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className={"loader-text"}>Loading...</div>
    </div>
}

Loader.defaultProps = {
    isActive: false
}

Loader.propTypes = {
    isActive: propTypes.bool
}

export default Loader;