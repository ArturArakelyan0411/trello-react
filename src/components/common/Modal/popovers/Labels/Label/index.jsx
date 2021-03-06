import React, {useState} from 'react';
import {useDispatch} from "react-redux";

import {activeLabelAction} from "../../../../../../store/columns/actions";

import styles from "./Label.module.scss";

const Label = ({label, card, onEdit, searchValue}) => {
  const dispatch = useDispatch();

  const [isLabelHover, setIsLabelHover] = useState(false);

  const activeLabel = card.labels.find(l => l.id === label.id);

  if(!label.value.includes(searchValue === ' ' ? '' : searchValue.trim())) {
    return null;
  }

  return (
    <li key={label.id} className={styles.popover__labels_label}>
      <div
        className={styles.popover__labels_label_color}
        style={{
          backgroundColor: label.color,
          boxShadow: isLabelHover ? `-8px 0 ${label.color}bb` : ''
        }}
        title={label.value}
        onClick={() => dispatch(activeLabelAction(label))}
        onMouseEnter={() => setIsLabelHover(true)}
        onMouseLeave={() => setIsLabelHover(false)}
      >
        {label.value &&
        <span className={`${styles.popover__labels_label_value} ${activeLabel ? styles.active : ''}`}>
          {label.value}
        </span>
        }

        <span className={`${styles.popover__labels_label_active} ${activeLabel ? styles.active : ''}`}>
          <i className="fas fa-check" />
        </span>
      </div>
      <span onClick={() => onEdit(label)}>
        <i className="fas fa-pencil-alt" />
      </span>
    </li>
  );
}

export default Label;
