import { useEffect, useState } from 'react';
import { RxLink1 } from 'react-icons/rx';
import { TbCopy, TbCornerDownLeft } from 'react-icons/tb';
import { loader } from '../assets';
import { useLazyGetSummaryQuery } from '../store';

const Summarizer = () => {
	const [allArticles, setAllArticles] = useState([]);
	const [article, setArticle] = useState({
		url: '',
		summary: '',
	});

	const [getSummary, { isFetching, error }] = useLazyGetSummaryQuery();

	useEffect(() => {
		const articlesFromLoaclStorage = JSON.parse(
			localStorage.getItem('articles'),
		);

		if (articlesFromLoaclStorage) setAllArticles(articlesFromLoaclStorage);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { data } = await getSummary({ articleUrl: article.url });

		if (data?.summary) {
			const newArticle = { ...article, summary: data.summary };
			const updatedAllArticles = [newArticle, ...allArticles];

			setArticle(newArticle);
			setAllArticles(updatedAllArticles);

			localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
		}
	};

	return (
		<section className="mt-16 w-full max-w-xl">
			<div className="flex flex-col w-full gap-2">
				{/* Search  */}
				<form
					className="relative justify-center items-center"
					onSubmit={handleSubmit}
				>
					<RxLink1 className="absolute letf-0 mt-3.5 ml-3" />

					<input
						type="url"
						placeholder="Enter Your URL"
						value={article.url}
						onChange={(e) => setArticle({ ...article, url: e.target.value })}
						required
						className="url_input peer"
					/>

					<button
						type="submit"
						className="submit_btn  peer-focus:border-gray-700 peer-focus:text-gray-700
					"
					>
						<TbCornerDownLeft />
					</button>
				</form>

				{/* URL History  */}
				<div className="flex flex-col gap-1 max-h-60 overflow-y-auto ">
					{allArticles.map((item, index) => (
						<div
							key={`link-${index}`}
							onClick={() => setArticle(item)}
							className="link_card"
						>
							<div className="copy_btn">
								<TbCopy className="w-[50%] h-[50%] object-contain" />
							</div>
							<p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
								{item.url}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Summary  */}
			<div className="my-10 max-w-full flex justify-center items-center">
				{isFetching ? (
					<img src={loader} alt="loader" className="w-20 h-20 object-contain" />
				) : error ? (
					<p>
						Apologies, we encountered a hiccup while fetching the requested
						data.
						<br />
						<span className="font-satoshi font-normal text-gray-700">
							{error?.data?.error}
						</span>
					</p>
				) : (
					article.summary && (
						<div className="flex flex-col gap-3">
							<h2 className="font-satoshi font-bold text-gray-700 text-xl">
								Article <span className="blue_gradient">Summary</span>
							</h2>

							<div className="summary_box">
								<p className="font-inter font-medium text-sm text-grat-700">
									{article.summary}
								</p>
							</div>
						</div>
					)
				)}
			</div>
		</section>
	);
};

export default Summarizer;

//
// TbCheck
