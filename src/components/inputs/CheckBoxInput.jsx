export function CheckBoxInput ({action, checked}) {

    const handleCheckboxChange = (value) => {
        action(value);
        console.log(value);
    };

    return <div className="checkbox-group">
        <label>
            <input
            type="radio"
            name="checkboxGroup"
            value={0}
            checked={checked === 0}
            onChange={() => handleCheckboxChange(0)}
            />
            Defecto
      </label>

      <label>
        <input
          type="radio"
          name="checkboxGroup"
          value={1}
          checked={checked === 1}
          onChange={() => handleCheckboxChange(1)}
        />
        HD
      </label>

      <label>
        <input
          type="radio"
          name="checkboxGroup"
          value={2}
          checked={checked === 2}
          onChange={() => handleCheckboxChange(2)}
        />
        Personalizado
      </label>
    </div>
}