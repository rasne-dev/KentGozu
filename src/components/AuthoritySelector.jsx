import React from 'react';
import { Building2, Check, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AuthoritySelector({
  authorities,
  selectedEmails,
  toggleEmailSelection
}) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            4. Yetkili Kurumlar & İletişim Adresleri
          </label>
          <p className="text-xs text-slate-500">
            Seçtiğiniz sorun ve yol yetki alanına göre otomatik belirlenen ilgili kurumlar:
          </p>
        </div>
      </div>

      {authorities.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-center">
          Lütfen yukarıdan ilçe veya yol sorumluluk tipini seçiniz.
        </div>
      ) : (
        <div className="space-y-2">
          {authorities.map((auth) => {
            const isChecked = selectedEmails.includes(auth.email);
            return (
              <div
                key={auth.email}
                onClick={() => toggleEmailSelection(auth.email)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isChecked
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-sm font-bold text-slate-900">
                        {auth.name}
                      </h5>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        auth.isPrimary
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {auth.role || 'Yetkili Kurum'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 font-mono text-blue-700 font-medium">
                        <Mail className="w-3 h-3" />
                        {auth.email}
                      </span>
                      {auth.phone && (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <Phone className="w-3 h-3" />
                          {auth.phone}
                        </span>
                      )}
                    </div>

                    {auth.description && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        {auth.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-medium text-slate-400">
                    {isChecked ? 'Gönderim Listesinde' : 'Hariç Tutuldu'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
