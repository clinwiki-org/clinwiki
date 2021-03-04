import * as React from 'react';
import { useEffect, useState } from 'react';
import { Checkbox } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';


interface FacetCardCheckboxProps {
    nctId: any;
    notKey: any;
    value: any;
    checkedValues: any;
    disabled: any;
    handleSelect2: any;
}

export default function FacetCardCheckbox (props: FacetCardCheckboxProps) {
    const {nctId, notKey, value, checkedValues, disabled, handleSelect2} = props;

    const [isChecked, setIsChecked] = useState(checkedValues.has(value));
    const isUpdating = useSelector((state:RootState) => state.study.isUpsertingLabel)
    const labels = useSelector((state:RootState) =>  state.study.suggestedLabels.data.study.wikiPage.meta)

    useEffect(() => {
        setIsChecked(checkedValues.has(value))
    }, [nctId, labels])
    
    const handleClick = () =>{
        setIsChecked(!isChecked)
        handleSelect2(notKey, value, checkedValues.has(value))
    }

    return (
        <Checkbox
            //key={value}
            checked={isChecked}
            disabled={isUpdating}
            onChange={handleClick}>
            {value}
        </Checkbox>
    );
}
