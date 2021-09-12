import propTypes from "prop-types";
import "./ListItem.css"

const ListItem = (props) => {

    const {isDraggable, onClick, character, target, onMove, lightMode} = props ;

    const onDrop = (e) =>{
        const rect = target.current.getBoundingClientRect();
        const curX = e.clientX
        const acceptX ={
            from: rect.x,
            to: rect.x+rect.width
        }

        if(curX<acceptX.to && curX>acceptX.from)
            onMove(character);

    }

    const classes = `list-element ${lightMode ? "light" : ""}`;
    return <div className={classes}
                onDragEnd={onDrop}
                draggable={isDraggable}
                onClick={onClick}
    >{character.name}</div>
}

ListItem.defaultProps ={
    onClose: () => void 0,
    onClick: () => void 0,
    onMove: () => void 0
}

ListItem.propTypes = {
    isDraggable:propTypes.bool,
    onClick: propTypes.func,
    character: propTypes.object,
    target: propTypes.any,
    onMove: propTypes.func,
    lightMode: propTypes.bool
}

export default ListItem;