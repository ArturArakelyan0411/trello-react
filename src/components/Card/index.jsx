import React from 'react';
import {useDispatch, useSelector} from "react-redux";

import {
  cardDragEndAction,
  cardDragStartAction,
  cardDropAction,
  changeColumnsActiveLabels
} from "../../store/columns/actions";

import styles from "./Card.module.scss";

const Card = ({card, column, modalOpen}) => {
  const dispatch = useDispatch();

  const {columnsActiveLabels, columns} = useSelector(state => state.columnsReducer);

  const isChecklistItems = card.checklist.map(list => list.items.length)
    .reduce((sum, current) => sum + current, 0);

  return (
    <button
      key={card.id}
      className={`${styles.column__card} ${card.cover.color && card.cover.type === 1 ? styles.cover : ''}`}
      onClick={() => modalOpen(column.id, card.id)}
      draggable={true}
      onDragStart={() => {
        const dragged = column.cardsArray.findIndex(c => c.id === card.id);
        dispatch(cardDragStartAction(dragged, card, column));
      }}
      onDragEnd={() => dispatch(cardDragEndAction())}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const dropped = column.cardsArray.findIndex(c => c.id === card.id);
        const droppedColumn = columns.findIndex(col => col.id === column.id);
        dispatch(cardDropAction(dropped, card, column, droppedColumn));
      }}
    >
      {card.cover.color && card.cover.type === 1 &&
      <div
        className={styles.column__card_cover}
        style={{backgroundColor: card.cover.color}}
      />}
      <div className={styles.column__card_content}>
        {!!card.labels.length &&
        <div className={styles.column__card_labels}>
          {card.labels.map(label => {
            return (
              <div
                key={label.id}
                className={`${styles.column__card_label} ${columnsActiveLabels ? styles.active : ''}`}
                title={label.value}
                style={{backgroundColor: label.color}}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(changeColumnsActiveLabels());
                }}
              >
                {columnsActiveLabels &&
                <span>
                  {label.value.length > 21 ? `${label.value.slice(0, 21)}...` : label.value}
                </span>
                }
              </div>
            )
          })}
        </div>
        }

        <span>{card.value}</span>

        {card.description || card.comments.length || isChecklistItems ?
          <div className={styles.column__card_badges}>
            {card.description &&
            <span title="Эта карточка с описанием." className={styles.column__card_badge}>
              <i className="fas fa-align-left" />
            </span>
            }
            {!!card.comments.length &&
            <span title="Комментарии" className={styles.column__card_badge}>
              <i className="far fa-comment" />
              <span style={{marginLeft: '4px'}}>{card.comments.length}</span>
            </span>
            }
            {!!card.checklist.length && isChecklistItems ?
              <span title="Элементы списка задач" className={styles.column__card_badge}>
                <i className="far fa-check-square" />
                <span style={{marginLeft: '4px'}}>
                  {card.checklist.map(list => {
                    return list.items.filter(item => item.completed).length;
                  }).reduce((sum, current) => sum + current, 0)}
                  /
                  {card.checklist.map(list => list.items.length)
                    .reduce((sum, current) => sum + current, 0)}
                </span>
              </span> : null
            }
          </div>
          : null
        }
      </div>
    </button>
  );
}

export default Card;