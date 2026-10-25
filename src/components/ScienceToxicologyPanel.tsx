import React, { useState, useEffect } from 'react';
import { FlaskConical, AlertTriangle, ShieldCheck, ExternalLink, RefreshCw, Database, Droplets } from 'lucide-react';

interface CompoundData {
  compound: string;
  cid?: number;
  iupacName?: string;
  molecularFormula?: string;
  molecularWeight?: string;
  npdesCompliance: {
    epaLimit: string;
    healthRisk: string;
    cleanWaterActCode: string;
  };
  pubchemUrl?: string;
  structure2dUrl?: string;
}

interface ScienceToxicologyPanelProps {
  demoTourActive?: boolean;
}

export const ScienceToxicologyPanel: React.FC<ScienceToxicologyPanelProps> = ({
  demoTourActive = false,
}) => {
  const [compound, setCompound] = useState('benzene');
  const [data, setData] = useState<CompoundData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompound = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/science/toxicology/${encodeURIComponent(name)}`);
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch chemical data.');
      }
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompound('benzene');
  }, []);

  const candidates = [
    { id: 'benzene', name: 'Benzene (Petroleum / VOC Runoff)', formula: 'C6H6' },
    { id: 'trichloroethylene', name: 'Trichloroethylene (TCE - Solvent)', formula: 'C2HCl3' },
    { id: 'lead', name: 'Lead (Heavy Metal)', formula: 'Pb' },
    { id: 'toluene', name: 'Toluene (Industrial Solvent)', formula: 'C7H8' },
    { id: 'pfas', name: 'PFAS (Perfluoroalkyl Substances)', formula: 'C8HF15O2' },
  ];

  // Automated cycling through all 5 chemical compound buttons during Cinematic Demo Act 21
  useEffect(() => {
    if (!demoTourActive) return;
    let idx = 0;
    const interval = window.setInterval(() => {
      idx = (idx + 1) % candidates.length;
      const nextId = candidates[idx].id;
      setCompound(nextId);
      fetchCompound(nextId);
    }, 4800);
    return () => window.clearInterval(interval);
  }, [demoTourActive]);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 overflow-y-auto text-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-950 border border-teal-800 text-teal-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Bioscience & Stormwater Toxicology Registry
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                PubChem API • Clean Water Act NPDES
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live chemical structure lookup & EPA municipal storm runoff thresholds
            </p>
          </div>
        </div>
      </div>

      {/* Selector Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {candidates.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setCompound(c.id);
              fetchCompound(c.id);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs transition-all flex items-center gap-2 ${
              compound === c.id
                ? 'bg-teal-600 border-teal-400 text-white font-semibold shadow-md shadow-teal-600/30'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
          <span className="text-xs font-mono">Querying PubChem & EPA Thresholds...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chemical Card */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Molecular Profile
              </span>
              {data.cid && (
                <span className="text-[11px] font-mono text-slate-400">
                  PubChem CID: {data.cid}
                </span>
              )}
            </div>

            {data.structure2dUrl && (
              <div className="w-full flex items-center justify-center p-3 bg-white rounded-lg">
                <img
                  src={data.structure2dUrl}
                  alt={`${data.compound} structure`}
                  className="max-h-36 object-contain"
                />
              </div>
            )}

            <div className="space-y-1.5 text-xs font-mono">
              <div>
                <span className="text-slate-400">IUPAC Name: </span>
                <span className="text-white block font-sans truncate">{data.iupacName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Formula:</span>
                <span className="text-teal-300 font-bold">{data.molecularFormula}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Molecular Wt:</span>
                <span className="text-slate-200">{data.molecularWeight} g/mol</span>
              </div>
            </div>

            {data.pubchemUrl && (
              <a
                href={data.pubchemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>View Full PubChem Record</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>

          {/* Environmental Compliance Card */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                EPA NPDES Runoff & Clean Water Act Exposure
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                Regulatory Metric
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  EPA Stormwater / Drinking Limit
                </span>
                <span className="text-sm font-bold text-red-400 font-mono mt-1 block">
                  {data.npdesCompliance.epaLimit}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Statutory Citation
                </span>
                <span className="text-xs font-semibold text-cyan-300 font-mono mt-1 block">
                  {data.npdesCompliance.cleanWaterActCode}
                </span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold block mb-1">
                Toxicological Health & Ecological Hazard:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {data.npdesCompliance.healthRisk}
              </p>
            </div>

            <div className="p-3 bg-teal-950/40 border border-teal-800/60 rounded-lg text-xs text-teal-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-teal-300">
                <ShieldCheck className="w-4 h-4" />
                Investigation Context: StormTech Bypass Impact
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                The removal of StormTech subsurface retention filtration units directly routes unmitigated
                run-off containing hydrocarbons and priority pollutants from the 17631 Cameron Lane parcel into the
                municipal storm sewer system, establishing potential strict liability under 33 U.S.C. § 1319.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
