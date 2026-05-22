import { Link } from 'react-router-dom';

export default function RequestCard({ request }) {
  return (
    <Link to={`/requests/${request.id}`} className="card block no-underline text-gray-800">
      <div className="flex items-start justify-between mb-2">
        <h3 className="m-0 text-base font-bold">{request.title}</h3>
        <span className="text-xs bg-[#1B6B3E]/10 text-[#1B6B3E] px-2 py-1 rounded-lg">{request.offer_count || 0} عروض</span>
      </div>
      <p className="m-0 text-sm text-gray-500 mb-3 truncate">{request.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#C6963D] font-bold">
          {request.budget_min?.toLocaleString()} - {request.budget_max?.toLocaleString()} ريال
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{request.city}</span>
          <span>{request.user_name}</span>
        </div>
      </div>
    </Link>
  );
}
