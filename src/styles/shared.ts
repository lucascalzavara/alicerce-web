import { css } from 'lit'

export const layoutStyles = css`
  .page {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    background: var(--cream);
    color: var(--ink);
    font-family: var(--font-body);
  }

  main {
    flex: 1;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .wrap {
    width: min(1120px, calc(100% - 40px));
    margin: 0 auto;
  }
`

export const formStyles = css`
  .auth-shell {
    min-height: 100svh;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    background: var(--cream);
    color: var(--ink);
    font-family: var(--font-body);
  }

  .aside {
    background:
      linear-gradient(180deg, rgba(44, 50, 58, 0.04), rgba(224, 122, 47, 0.08)),
      var(--cream);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 36px 48px 40px;
    border-right: 1px solid var(--line);
  }

  .aside img {
    width: min(360px, 100%);
    display: block;
  }

  .aside h1 {
    font-family: var(--font-display);
    font-size: 2.1rem;
    line-height: 1.15;
    margin: 28px 0 12px;
  }

  .aside p {
    margin: 0;
    color: var(--ink-soft);
    max-width: 38ch;
    font-size: 1.05rem;
  }

  .panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
  }

  form,
  .card {
    width: min(440px, 100%);
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 32px;
  }

  h2 {
    font-family: var(--font-display);
    margin: 0 0 6px;
    font-size: 1.7rem;
  }

  .lead {
    margin: 0 0 24px;
    color: var(--ink-soft);
  }

  label {
    display: grid;
    gap: 6px;
    margin-bottom: 14px;
    font-size: 0.92rem;
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid var(--line);
    background: #fff;
    border-radius: 10px;
    padding: 11px 12px;
    color: var(--ink);
    outline: none;
  }

  textarea {
    min-height: 84px;
    resize: vertical;
  }

  input:focus,
  textarea:focus {
    border-color: var(--orange);
    box-shadow: 0 0 0 3px rgba(224, 122, 47, 0.18);
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .actions {
    display: grid;
    gap: 10px;
    margin-top: 8px;
  }

  button[type='submit'],
  .primary {
    border: 0;
    background: var(--orange);
    color: #fff;
    font-weight: 700;
    border-radius: 10px;
    padding: 12px 16px;
    cursor: pointer;
  }

  button[type='submit']:hover,
  .primary:hover {
    background: var(--orange-dark);
  }

  button:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  .ghost {
    display: inline-flex;
    justify-content: center;
    padding: 10px;
    color: var(--ink-soft);
  }

  .error {
    background: #fdecea;
    color: var(--danger);
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 16px;
    font-size: 0.95rem;
  }

  .companies {
    display: grid;
    gap: 10px;
  }

  .company {
    text-align: left;
    border: 1px solid var(--line);
    background: #fff;
    border-radius: 12px;
    padding: 14px 16px;
    cursor: pointer;
  }

  .company:hover,
  .company[aria-pressed='true'] {
    border-color: var(--orange);
    box-shadow: 0 0 0 3px rgba(224, 122, 47, 0.15);
  }

  .company strong {
    display: block;
    font-family: var(--font-display);
  }

  .company span {
    color: var(--ink-soft);
    font-size: 0.9rem;
  }

  @media (max-width: 860px) {
    .auth-shell {
      grid-template-columns: 1fr;
    }

    .aside {
      border-right: 0;
      border-bottom: 1px solid var(--line);
      padding: 24px 20px;
    }

    .aside img {
      width: min(220px, 70%);
    }

    .row {
      grid-template-columns: 1fr;
    }
  }
`
