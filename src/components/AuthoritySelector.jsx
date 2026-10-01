import React from 'react';
import { Building2, Check, Mail, Phone, ShieldCheck, Info } from 'lucide-react';

export default function AuthoritySelector({
  authorities,
  selectedEmails,
  toggleEmailSelection,
  onSetSelectedEmails,
  isInvalid = false
}) {
  const selectAll = () => {
    if (onSetSelectedEmails) {
      onSetSelectedEmails(authorities.map((a) => a.email));
    } else {
      authorities.forEach((auth) => {
        if (!selectedEmails.includes(auth.email)) {
          toggleEmailSelection(auth.email);
        }
      });
    }
  };

  const selectOnlyPrimary = () => {
    const primary = authorities.find((a) => a.isPrimary) || authorities[0];
    if (primary) {
      if (onSetSelectedEmails) {
        onSetSelectedEmails([primary.email]);
      } else {
        authorities.forEach((auth) => {
          if (auth.email === primary.email && !selectedEmails.includes(auth.email)) {
            toggleEmailSelection(auth.email);
          } else if (auth.email !== primary.email && selectedEmails.includes(auth.email)) {
            toggleEmailSelection(auth.email);
          }
        });
      }
    }
  };

  return (
    <div 
      id="step-authority-selector" 
      className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border transition-all ${
        isInvalid 
          ? 'border-red-500 ring-2 ring-red-500/20 shadow-md' 
          : 'border-slate-200 dark:border-slate-800 shadow-xs'
      } space-y-3.5`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
            5
          </span>
          <div>
            <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Adım 5: Yetkili Kurumlar & İletişim Kanalları</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Konumunuza ve aksaklık türüne göre otomatik eşleşen kurumlar. E-posta taslağınız bu adreslere iletilir.
            </p>
          </div>
        </div>

        {authorities.length > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={selectAll}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Tümünü Seç
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              type="button"
              onClick={selectOnlyPrimary}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium cursor-pointer"
            >
              Sadece Asıl Yetkili
            </button>
          </div>
        )}
      </div>

      {authorities.length === 0 ? (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400 text-center flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          <span>Yetkili kurumları listelemek için lütfen yukarıdan ilçe veya yol tipini seçiniz.</span>
        </div>
      ) : (
        <div className="space-y-2.5">
          {authorities.map((auth) => {
            const isChecked = selectedEmails.includes(auth.email);
            return (
              <div
                key={auth.email}
                onClick={() => toggleEmailSelection(auth.email)}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isChecked
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/50 shadow-xs ring-1 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {auth.name}
                      </h5>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        auth.isPrimary
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {auth.role || 'Yetkili Kurum'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 font-mono text-blue-700 dark:text-blue-400 font-medium">
                        <Mail className="w-3.5 h-3.5" />
                        {auth.email}
                      </span>
                      {auth.phone && (
                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Phone className="w-3.5 h-3.5" />
                          {auth.phone}
                        </span>
                      )}
                    </div>

                    {auth.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {auth.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg ${
                    isChecked
                      ? 'text-blue-700 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-900/40'
                      : 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {isChecked ? '✓ Gönderim Listesinde' : 'Hariç Tutuldu'}
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
