'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Github, Loader2 } from 'lucide-react';

import { createProject } from '@/components/project-api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface OnboardingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const STEPS = [
    { label: 'Connect GitHub' },
    { label: 'Import Project' },
    { label: 'Get Started' },
];

const MOCK_REPOS = [
    { full_name: 'acmecorp/web-frontend', desc: 'NextJS React frontend application' },
    { full_name: 'acmecorp/api-gateway', desc: 'Go microservice aggregation layer' },
    { full_name: 'prince/codex-hackathon', desc: 'Hackathon repo for CodexFlow' },
];

export default function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when opened
    useEffect(() => {
        if (open) {
            setStep(0);
            setLoading(false);
            setError(null);
        }
    }, [open]);

    const handleConnect = () => {
        setLoading(true);
        // Simulate OAuth redirect latency
        setTimeout(() => {
            setLoading(false);
            setStep(1);
        }, 1200);
    };

    const handleImport = async (repo: typeof MOCK_REPOS[0]) => {
        setLoading(true);
        setError(null);
        try {
            await createProject({
                name: repo.full_name,
                description: repo.desc,
                repoPath: '.',
            });
            setStep(2);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import repository.');
        } finally {
            setLoading(false);
        }
    };

    const handleDone = () => {
        onOpenChange(false);
        router.push('/board?from=onboarding');
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !loading && onOpenChange(val)}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Onboarding</DialogTitle>
                    <DialogDescription>
                        Connect your project to start routing your coding tasks through CodexFlow.
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="my-6 flex items-center justify-center gap-2">
                    {STEPS.map((s, i) => (
                        <div key={s.label} className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${i <= step
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {i < step ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span
                                    className={`text-sm ${i <= step ? 'text-foreground font-medium' : 'text-muted-foreground'
                                        }`}
                                >
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-px w-8 ${i < step ? 'bg-primary' : 'bg-border'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Views */}
                <div className="min-h-[220px]">
                    {step === 0 && (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center border rounded-[var(--radius)] bg-card border-border">
                            <Github className="h-10 w-10 text-muted-foreground" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Authenticate with GitHub</h3>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    CodexFlow needs access to scan files, commit changes, and trigger workflows on your repository.
                                </p>
                            </div>
                            <Button onClick={handleConnect} disabled={loading} className="mt-4 gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                                {loading ? 'Authenticating...' : 'Connect to GitHub'}
                            </Button>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Select a repository</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Choose which project to analyze. A corresponding Project will be created.
                                </p>
                            </div>

                            <div className="space-y-2">
                                {MOCK_REPOS.map((repo) => (
                                    <button
                                        key={repo.full_name}
                                        onClick={() => handleImport(repo)}
                                        disabled={loading}
                                        className="flex w-full flex-col items-start rounded-md border border-border p-3 text-left transition-all hover:bg-muted disabled:opacity-50"
                                    >
                                        <span className="text-sm font-medium text-foreground">{repo.full_name}</span>
                                        <span className="text-xs text-muted-foreground mt-1">{repo.desc}</span>
                                    </button>
                                ))}
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            {loading && (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center border rounded-[var(--radius)] bg-emerald-500/10 border-emerald-500/20">
                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">You&apos;re all set!</h3>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Your project has been successfully imported. You can now track implementations, bugs, and tests across the Kanban Board.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
                        {step === 2 ? 'Close' : 'Cancel'}
                    </Button>
                    {step === 2 && (
                        <Button onClick={handleDone}>Go to Board</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
