import { Select } from "antd";



/**
 * @param optionsAtLevel[0] [{id, name}] (of category)
 * @param {String} valueAtLevel[0] catId that is selected at level 0
 * @param {Function} onSelect (level, catId) => {should set new optionsAtLevel, optionsAtLevel}
 * @param {Function} onClear (level) => {should set new optionsAtLevel, optionsAtLevel}
 */
export default function SelectCategories({optionsAtLevel, valueAtLevel, onSelect, onClear}) {
    return (<div>
        {optionsAtLevel.map((options, idx)=><Select key={valueAtLevel[idx]}
        options={options.map((option)=>({value: option.id, label: option.name}))} value={valueAtLevel[idx]} allowClear
        onSelect={(value)=>{onSelect(idx, value)}} onClear={()=>{onClear(idx)}}
        ></Select>)}
    </div>)
}