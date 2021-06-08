import React from "react";

// Select function for the userEdit
// props are reuseable elements which is basically the input you put in when using the function
// e.g. <Select form='theData' id='genderInterestList' name='genderInterestList' value={selectGenderInterestBox} onChange={onChangeGenderInterest} data={genderInterestFetch}
function Select(props) {
  return (
    <select form={props.form} id={props.id} name={props.name} value={props.value} onChange={props.onChange}>
      {props.data.map(item => (
        <option value={item.id} key={item.id}>
          {item.gender || item.gender_Interest || item.interest}
        </option>
      ))}
    </select>
  );
}

export default Select;
