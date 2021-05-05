import React, {useState} from 'react';

import Label from "./Label";
import EditingLabel from "./EditingLabel";
import CreatingLabel from "./CreatingLabel";
import Cover from "./Cover";
import Checklist from "./Checklist";

const ModalPopover = ({popoverType, setPopoverType, popoverRef, card}) => {
  const [editingLabel, setEditingLabel] = useState({
    id: null,
    value: '',
    color: ''
  });

  switch(popoverType) {
    case 'label': {
      return (
        <Label
          setPopoverType={setPopoverType}
          popoverRef={popoverRef}
          card={card}
          setEditingLabel={setEditingLabel}
        />
      );
    }
    case 'editingLabel': {
      return (
        <EditingLabel
          setPopoverType={setPopoverType}
          popoverRef={popoverRef}
          editingLabel={editingLabel}
          setEditingLabel={setEditingLabel}
        />
      );
    }
    case 'creatingLabel': {
      return (
        <CreatingLabel
          setPopoverType={setPopoverType}
          popoverRef={popoverRef}
        />
      );
    }
    case 'cover': {
      return (
        <Cover
          setPopoverType={setPopoverType}
          popoverRef={popoverRef}
          card={card}
        />
      );
    }
    case 'checkList': {
      return (
        <Checklist
          setPopoverType={setPopoverType}
          popoverRef={popoverRef}
        />
      );
    }
    default: {
      return null;
    }
  }
}

export default ModalPopover;