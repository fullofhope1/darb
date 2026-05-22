import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  const images = service.images || [];
  return (
    <Link to={`/services/${service.id}`} className="card block no-underline text-gray-800">
      {images[0] && (
        <img src={images[0]} alt="" className="w-full h-36 object-cover rounded-xl mb-3" style={{ background: '#e5e7eb' }} />
      )}
      <h3 className="m-0 text-base font-bold mb-1">{service.title}</h3>
      <p className="m-0 text-sm text-gray-500 mb-2 truncate">{service.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-[#1B6B3E] font-bold text-lg">{service.price?.toLocaleString()} ريال</span>
        <span className="text-xs text-gray-400">{service.user_name}</span>
      </div>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-yellow-500 text-xs">{'★'.repeat(Math.round(service.user_rating || 0))}</span>
        <span className="text-xs text-gray-400">({service.user_rating || 0})</span>
        {service.city && <span className="text-xs text-gray-400 mr-auto">{service.city}</span>}
      </div>
    </Link>
  );
}
