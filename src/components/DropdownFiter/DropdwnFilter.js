import propTypes from "prop-types";

const DropdownFilter = (props) => {
    const { label, items, onChange} = props;

    const onSelect = (e) => {
        let selectedUrl = e.target.value;
        let selectedItem = items.filter( ({url}) => url===selectedUrl)[0];
        return onChange(selectedItem);
    }

    return <div className={"filter-row"}>
        {label && <span ><b>{label}</b></span>}
        <select className={"inputStyle"} onChange={onSelect}>
            <option value> </option>
            {items.map( ({title, name, url}, i) => {
                const label = title ? title : name;
                 return <option value={url} key={`i${url}`}>{label}</option>
            })}
        </select>
    </div>
}

DropdownFilter.defaultProps = {
    items: [],
    onSelected: () => void 0
}

DropdownFilter.propTypes = {
    label: propTypes.string,
    items: propTypes.arrayOf(propTypes.shape({
        url: propTypes.string,
        name: propTypes.string,
        title: propTypes.string
    })),
    onChange: propTypes.func,
}

export default DropdownFilter;