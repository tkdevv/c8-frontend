import React from "react";

const StartGameForm = (props) => {
  return (
    <div>
      <form
        className="start-game-form"
        onSubmit={props.handleSubmit(props.startGameHandler)}
      >
        <label className="input-label">Your Handle</label>
        <input
          className="handle-input"
          name="handle"
          ref={props.register({ required: true, minLength: 3, maxLength: 9 })}
        />
        {props.errors.handle && (
          <p>Handle between 3 and 9 characters required</p>
        )}

        <hr />

        <label className="input-label">Just Watch</label>
        <input
          type="checkbox"
          name="justWatch"
          className="home-checkbox"
          ref={props.register}
        />

        <hr />
        {/* <label className="input-label">Number of Cards</label>
        <select name="numOfCards" ref={props.register({ required: true })}>
          <option value={4}>4</option>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
        </select> */}

        <label className="input-label">Joker Tally</label>
        <select name="jokerTally" ref={props.register({ required: true })}>
          <option value={4}>4</option>
          <option value={6}>6</option>
          <option value={8}>8</option>
        </select>

        <input className="home-submit-btn" type="submit" />
      </form>
    </div>
  );
};

export default StartGameForm;
