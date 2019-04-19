import * as React from 'react';
import { useContext } from 'react';

import { PullRequest } from './cache';
import { Avatar, AuthorLink } from './user';
import { Spaced } from './space';
import PullRequestContext from './context';
import { checkIcon } from './icon';
import Timestamp from './timestamp';
import { PullRequestStateEnum } from '../src/github/interface';

export function Header({ state, title, number, head, base, url, createdAt, author, }: PullRequest) {
	const { refresh } = useContext(PullRequestContext);
	return <>
		<div className='overview-title'>
			<h2>{title} (<a href={url}>#{number}</a>)</h2>
			<div className='button-group'>
				<CheckoutButtons />
				<button onClick={refresh}>Refresh</button>
			</div>
		</div>
		<div className='subtitle'>
			<div id='status'>{getStatus(state)}</div>
			<Avatar for={author} />
			<span className='author'>
				<Spaced>
					<AuthorLink for={author} /> wants to merge changes
					from <code>{head}</code>
					to <code>{base}</code>
				</Spaced>.
			</span>
			<span className='created-at'>
				<Spaced>
					Created <Timestamp date={createdAt} href={url} />
				</Spaced>
			</span>
		</div>
	</>;
}

const CheckoutButtons = () => {
	const { pr, exitReviewMode, checkout } = useContext(PullRequestContext);
	if (pr.isCurrentlyCheckedOut) {
		return <>
			<button aria-live='polite' className='checkedOut' disabled>{checkIcon} Checked Out</button>
			<button aria-live='polite' onClick={exitReviewMode}>Exit Review Mode</button>
		</>;
	} else {
		return <button aria-live='polite' onClick={checkout}>Checkout</button>;
	}
};

export function getStatus(state: PullRequestStateEnum) {
	if (state === PullRequestStateEnum.Merged) {
		return 'Merged';
	} else if (state === PullRequestStateEnum.Open) {
		return 'Open';
	} else {
		return 'Closed';
	}
}