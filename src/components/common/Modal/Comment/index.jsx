import React, {useState} from 'react';
import {useDispatch} from "react-redux";

import moment from "moment";

import {deleteCommentAction, editCommentAction} from "../../../../store/columns/actions";

import useFormCollapse from "../../../../hooks/useFormCollapse";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import useEscClick from "../../../../hooks/useEscClick";

import user from '../../../../assets/images/user.png';

import styles from './Comment.module.scss';
import modalStyles from '../Modal.module.scss';

const Comment = ({comment}) => {
  const {time, fullTime, value, changed, changedTime} = comment;
  const dispatch = useDispatch();
  const formCollapse = useFormCollapse();

  const [commentEditingCollapse, setCommentEditingCollapse] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  const commentSave = () => {
    if(commentValue.trim()) {
      dispatch(editCommentAction(comment.id, commentValue));
      formCollapse(setCommentEditingCollapse, setCommentValue);
    }
  }

  const ref = useOutsideClick(() => formCollapse(setCommentEditingCollapse, setCommentValue));
  useEscClick(() => formCollapse(setCommentEditingCollapse, setCommentValue), ref);

  return (
    <div className={modalStyles.modal__card_comments_details_container}>
      <div className={modalStyles.modal__card_section}>
        <div className={modalStyles.modal__card_comments_avatar}>
          <img
            src={user}
            alt="Avatar"
          />
        </div>

        <div className={styles.comment}>
          <div className={styles.comment__time}>
            <p className={styles.comment__time_username}>
              user
            </p>
            <div title={time} className={styles.comment__created_time}>
              <span>{moment(fullTime).fromNow()}</span>
              {changed &&
              <span title={changedTime ? moment(changedTime).fromNow() : ''}>(изменён)</span>
              }
            </div>
          </div>

          {!commentEditingCollapse && <p className={styles.comment__value}>{value}</p>}

          {commentEditingCollapse ?
            <div className={styles.comment__edit} ref={ref}>
              <textarea
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                onFocus={() => setCommentValue(value)}
                autoFocus
              />
              <div className={styles.comment__edit_actions}>
                <button
                  onClick={commentSave}
                  className="form__submit"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => formCollapse(setCommentEditingCollapse, setCommentValue)}
                  className="form__close"
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>
            :
            <div className={styles.comment__actions}>
              <button onClick={() => formCollapse(setCommentEditingCollapse, setCommentValue)}>
                Изменить
              </button>
              <span>-</span>
              <button onClick={() => dispatch(deleteCommentAction(comment.id))}>
                Удалить
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default Comment;
