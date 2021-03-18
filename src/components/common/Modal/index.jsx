import React, {useState, useEffect, useRef} from 'react';
import ReactModal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";

import {
  changeCardNameAction,
  changeCardDescriptionAction,
  addCommentAction
} from '../../../store/columns/actions';

import useFormCollapse from "../../../hooks/useFormCollapse";

import './styles.scss';
import styles from './Modal.module.scss';

ReactModal.setAppElement('#root');

const Modal = ({modalIsOpen, modalClose}) => {
  const dispatch = useDispatch();
  const formCollapse = useFormCollapse();

  const editingColumn = useSelector(state => state.columnsReducer.editingColumn);
  const {column, card} = editingColumn;

  const cardNameRef = useRef(null);
  const descriptionRef = useRef(null);

  const [cardNameFormCollapse, setCardNameFormCollapse] = useState(false);
  const [cardNameValue, setCardNameValue] = useState(card?.value);

  const [descriptionFormCollapse, setDescriptionFormCollapse] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(card?.description);

  const [commentFormCollapse, setCommentFormCollapse] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  useEffect(() => {
    if(cardNameRef.current) {
      cardNameRef.current.focus();
    }
  }, [cardNameFormCollapse]);

  useEffect(() => {
    if(descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, [descriptionFormCollapse]);

  const cardNameFormSubmit = (e) => {
    e.preventDefault();

    if(cardNameValue.trim()) {
      dispatch(changeCardNameAction(card?.id, column?.id, cardNameValue));
      formCollapse(setCardNameFormCollapse, setCardNameValue, card?.value);
    }
  }

  const cardDescriptionFormSubmit = (e) => {
    e.preventDefault();
    dispatch(changeCardDescriptionAction(card?.id, column?.id, descriptionValue));
    formCollapse(setDescriptionFormCollapse, setDescriptionValue, card?.description)
  }

  return (
    <ReactModal
      closeTimeoutMS={300}
      isOpen={modalIsOpen}
      shouldCloseOnOverlayClick={true}
      onRequestClose={modalClose}
      style={
        {
          content: {
            width: '750px',
            borderRadius: '3px',
            height: 'fit-content',
            margin: '0 auto 80px auto',
            padding: '20px 10px',
            border: 'none',
            backgroundColor: '#EBECF0',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          },
          overlay: {
            zIndex: '1000',
            overflow: 'auto'
          }
        }
      }
    >
      <div className={styles.modal__card_infos}>
        <div className={styles.modal__card_info}>
          <span className={styles.modal__card_info_icon}>
            <i className="far fa-credit-card" />
          </span>
          <div className={styles.modal__card_info_details}>
            {cardNameFormCollapse ?
              <form
                onSubmit={cardNameFormSubmit}
                className={styles.modal__card_info_details_card_name_form}
              >
                <input
                  type='text'
                  value={cardNameValue}
                  onChange={(e) => setCardNameValue(e.target.value)}
                  ref={cardNameRef}
                />
              </form>
              :
              <p
                className={styles.modal__card_info_details_card_name}
                onClick={() => formCollapse(setCardNameFormCollapse, setCardNameValue, card?.value)}
              >
                {card?.value}
              </p>
            }

            <span>в колонке {column?.value}</span>
          </div>
        </div>

        <div className={styles.modal__card_info}>
          <span className={styles.modal__card_info_icon}>
            <i className="fas fa-align-justify" />
          </span>
          <div className={styles.modal__card_info_details}>
            <p>Описание</p>

            {card?.description && !descriptionFormCollapse ?
              <p
                className={styles.modal__card_info_details_description}
                onClick={() => formCollapse(setDescriptionFormCollapse, setDescriptionValue, card?.description)}
              >
                {card?.description}
              </p> :
              !card?.description && !descriptionFormCollapse ?
              <button
                type="button"
                onClick={() => formCollapse(setDescriptionFormCollapse, setDescriptionValue, card?.description)}
                className={styles.modal__card_info_details_button}
              >
                Добавить более подробное описание...
              </button> :
              <form
                className={styles.modal__card_info_details_add}
                onSubmit={cardDescriptionFormSubmit}
              >
                <textarea
                  placeholder='Добавить более подробное описание...'
                  value={descriptionValue}
                  onChange={(e) => setDescriptionValue(e.target.value)}
                  ref={descriptionRef}
                />
                <div className={styles.modal__card_info_details_add_actions}>
                  <button className={styles.modal__card_info_details_add_actions_save}>
                    Сохранить
                  </button>
                  <button
                    type='button'
                    className={styles.modal__card_info_details_add_actions_close}
                    onClick={() => formCollapse(setDescriptionFormCollapse, setDescriptionValue, card?.description)}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              </form>
            }
          </div>
        </div>

        <div className={`${styles.modal__card_info} ${styles.modal__card_info_actions}`}>
          <div className={styles.modal__card_info_icon_and_details}>
            <span className={styles.modal__card_info_icon}>
              <i className="fas fa-align-left" />
            </span>
            <div className={styles.modal__card_info_details}>
              <p>Действия</p>
            </div>
          </div>

          <div className={styles.modal__card_info_actions_comment}>
            <div className={styles.modal__card_info_actions_comment_avatar_container}>
              <img
                src="https://trello-members.s3.amazonaws.com/60058042b46eb66edeca586b/a96d6a3db08e0252d26932585362b287/30.png"
                alt="Avatar"
              />
            </div>
            <div className={`${styles.modal__card_info_actions_comment_container} ${!commentFormCollapse ? styles.hide : ''}`}
            >
              <textarea
                placeholder='Напишите комментарий...'
                value={commentValue}
                onClick={() => (setCommentFormCollapse(true))}
                onChange={(e) => setCommentValue(e.target.value)}
              />
              <button
                className={`${styles.modal__card_info_actions_comment_save} ${!commentValue.trim() ? styles.disabled : ''}`}
                onClick={() => {
                  dispatch(addCommentAction(card?.id, column?.id, commentValue));
                  formCollapse(setCommentFormCollapse, setCommentValue, '');
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
          {card?.comments.map(comment => {
            const {time, fullTime, value} = comment;
            return (
              <div className={styles.modal__card_info_actions_comment_comment} key={comment.id}>
                <div className={styles.modal__card_info_actions_comment_comment_avatar_section}>
                  <img src="https://trello-members.s3.amazonaws.com/60058042b46eb66edeca586b/a96d6a3db08e0252d26932585362b287/30.png" alt="Avatar"/>
                </div>
                <div className={styles.modal__card_info_actions_comment_comment_info_section}>
                  <div className={styles.modal__card_comment_time}>
                    <p className={styles.modal__card_comment_time_username}>
                      user
                    </p>
                    <div title={time} className={styles.modal__card_comment_created_time}>
                      <span>{moment(fullTime).fromNow()}</span>
                    </div>
                  </div>
                  <p className={styles.modal__card_comment_value}>
                    {value}
                  </p>
                  <div className={styles.modal__card_comment_actions}>
                    <button>Изменить</button>
                    <span>-</span>
                    <button>Удалить</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.modal__card_upgrades_menu}>
        <div className={styles.modal__card_upgrades}>
          <h5 className={styles.modal__card_upgrade_heading}>добавить на карточку</h5>
          <button className={styles.modal__card_upgrade_button}>
            <i className="far fa-user" />
            <p>Участники</p>
          </button>
          <button className={styles.modal__card_upgrade_button}>
            <i className="fas fa-tag" />
            <p>Метки</p>
          </button>
          <button className={styles.modal__card_upgrade_button}>
            <i className="far fa-check-square" />
            <p>Чек-лист</p>
          </button>
          <button className={styles.modal__card_upgrade_button}>
            <i className="far fa-clock" />
            <p>Срок</p>
          </button>
          <button className={styles.modal__card_upgrade_button}>
            <i className="fas fa-paperclip" />
            <p>Вложение</p>
          </button>
          <button className={styles.modal__card_upgrade_button}>
            <i className="far fa-credit-card" />
            <p>Обложка</p>
          </button>
        </div>
      </div>
    </ReactModal>
  );
}

export default Modal;
