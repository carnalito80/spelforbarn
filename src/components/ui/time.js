
import { cx } from "/utils/all";

export default function DateTime({ date, className }) {
  return (
    <time className={cx(className && className)} dateTime={date}>
      {new Date(post.date).toLocaleDateString("sv-SE")}
    </time>
  );
}
