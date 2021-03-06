import React from 'react';
import {useSelector} from "react-redux";

import Popover from "../../../Popover";
import Label from "./Label";

import styles from "./Labels.module.scss";

const LabelPopover = ({setPopoverType, popoverRef, setEditingLabel, card, searchValue, setSearchValue}) => {
  const labels = useSelector(state => state.columnsReducer.labels);

  let searchedLabels = labels.filter(label => label.value.includes(searchValue === ' ' ? '' : searchValue.trim())).length;

  return (
    <Popover
      heading="Метки"
      close={() => setPopoverType(null)}
      popoverRef={popoverRef}
    >
      <form
        className={styles.popover__labels_search_form}
        onSubmit={(e) => {
          e.preventDefault();
          setPopoverType('creatingLabel');
        }}
      >
        <input
          type="text"
          placeholder="Поиск меток..."
          className={styles.popover__labels_search_input}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoFocus
        />
      </form>

      <h4 className={styles.popover__labels_subheading}>Метки</h4>
      {searchedLabels ?
        <ul className={styles.popover__labels}>
          {labels.map(label => {
            return <Label
              key={label.id}
              label={label}
              card={card}
              onEdit={(label) => {
                setPopoverType('editingLabel');
                setEditingLabel(label);
              }}
              searchValue={searchValue}
            />;
          })}
        </ul>
        :
        <button
          className={`${styles.popover__label_create_button} ${styles.popover__label_notFound}`}
          onClick={() => setPopoverType('creatingLabel')}
        >
          Создать новую метку «{searchValue}»
        </button>
      }

      {!!searchedLabels &&
        <button
          className={styles.popover__label_create_button}
          onClick={() => setPopoverType('creatingLabel')}
        >
          Создать новую метку
        </button>
      }
    </Popover>
  );
}

export default LabelPopover;
