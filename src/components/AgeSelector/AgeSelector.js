import propTypes from "prop-types";
import {useState} from "react";

const AgeSelector = (props) => {
    const eras = ["BBY", "ABY"]
    const [number, setNumber] = useState();
    const [era, setEra] = useState(eras[0])

    const { label, min, max, onSelected, defaultValue} = props;

    const onEraChange = (e) => {
        let updatedEra = e.target.value
        setEra(updatedEra)
        if(number)
            onSelected({
                era: updatedEra,
                number,
                str: `${number}${updatedEra}`
            })
    }

    const onNumberChange = (e) => {
        let updatedNumber = e.target.value;
        setNumber(updatedNumber);
        onSelected({
            era,
            number: updatedNumber,
            str: `${updatedNumber}${era}`
        })
    }

    return <div className={"age-filter"}>
        {label && <span>{label}</span>}
        <input type="number" min={min} max={max} step="0.1" className={"inputStyle"}
               onChange={onNumberChange}/>
        <select onChange={onEraChange} className={"inputStyle"} defaultValue={"BBY"}>
            {eras.map(e => <option value={e} key={`${label}${e}`}>{e}</option>)}
        </select>
    </div>
}

AgeSelector.defaultProps = {
    onSelected: () => void 0,
    defaultValue: "BBY"

}

AgeSelector.propTypes = {
    min: propTypes.number,
    max: propTypes.number,
    onSelected: propTypes.func,
    label: propTypes.string,
    defaultValue: propTypes.oneOf(["BBY", "ABY"])
}

export default AgeSelector;