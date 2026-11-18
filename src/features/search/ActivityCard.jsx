export default function ActivityCard({ activity }) {
  const {
    name,
    address,
    categories = [],
    distance,
    score,
  } = activity;

  const categoryName = Array.isArray(categories) && categories.length > 0
    ? (typeof categories[0] === 'string' ? categories[0] : categories[0].name)
    : (typeof categories === 'string' ? categories : 'Activité');

  let formattedDistance = null;
  if (distance !== undefined && distance !== null) {
    if (distance >= 1000) {
      formattedDistance = `${(distance / 1000).toFixed(1)} km`;
    } else {
      formattedDistance = `${Math.round(distance)} m`;
    }
  }

  let formattedScore = null;
  if (score !== undefined && score !== null) {
    formattedScore = `${Math.round(score)}/100`;
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[6px_6px_0px_#3fa678] transition-transform hover:-translate-y-0.5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-bold text-xl text-gray-900 leading-snug">{name}</h3>

          <div className="flex items-center gap-2 shrink-0">
            {formattedScore && (
              <span className="bg-amber-100 text-amber-800 font-semibold text-xs px-3 py-1 rounded-full">
                ★ {formattedScore}
              </span>
            )}
            {formattedDistance && (
              <span className="bg-emerald-100 text-emerald-800 font-semibold text-xs px-3 py-1 rounded-full">
                {formattedDistance}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">{categoryName}</p>
        {address && (
          <p className="text-emerald-700 text-sm mt-2 mb-3"> {address}</p>
        )}
      </div>

      <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors">
        <span>Voir les détails</span>
        <span>→</span>
      </button>
    </div>
  );
}