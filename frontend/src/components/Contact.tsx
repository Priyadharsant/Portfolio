import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, scrollRevealLeft, scrollRevealRight } from '../utils/motion';
import SectionHeader from './SectionHeader';
import { apiUrl } from '../utils/api';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

type ContactProps = {
    profile: PortfolioData['profile'];
    contact: PortfolioData['contact'];
};

const Contact = ({ profile, contact }: ContactProps) => {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const contacts = [
        { label: profile.email, href: `mailto:${profile.email}`, icon: Mail },
        { label: 'LinkedIn', href: profile.linkedin, icon: Linkedin },
        { label: 'GitHub', href: profile.github, icon: Github },
    ];

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = {
            name: String(formData.get('name') ?? ''),
            email: String(formData.get('email') ?? ''),
            message: String(formData.get('message') ?? ''),
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
            setStatus('error');
            setStatusMessage('Please enter a valid email address.');
            return;
        }

        try {
            const response = await fetch(apiUrl('/api/contact'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message ?? 'Failed to send message.');
            }

            setStatus('success');
            setStatusMessage(data.message ?? 'Message sent successfully.');
            form.reset();
        } catch (error) {
            setStatus('error');
            setStatusMessage(error instanceof Error ? error.message : 'Failed to send message.');
        }
    };

    return (
        <section id="contact" className="border-b border-slate-200/80 bg-transparent dark:border-white/10">
            <div className="section-shell">
                <SectionHeader kicker="Reach out" title="Contact" />
                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <motion.div
                        className="glass-panel interactive-card rounded-xl p-6"
                        variants={scrollRevealLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        whileHover={cardHover}
                    >
                        <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Get in touch</h3>
                        <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
                            {contact.intro}
                        </p>
                        <div className="mt-6 space-y-3">
                            {contacts.map(({ label, href, icon: Icon }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                                    rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                                    className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-teal-500/30 hover:bg-teal-50/50 hover:text-teal-700 transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
                                    whileHover={{ x: 4 }}
                                >
                                    <Icon className="h-5 w-5 text-teal-600 dark:text-teal-300" />
                                    <span>{label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="glass-panel interactive-card rounded-xl p-6 sm:p-8"
                        variants={scrollRevealRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                                    placeholder="How can I help you?"
                                />
                            </div>

                            {statusMessage && (
                                <p
                                    className={`text-sm ${
                                        status === 'success' ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'
                                    }`}
                                >
                                    {statusMessage}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="primary-action w-full justify-center disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                                {status === 'loading' ? 'Sending...' : 'Send message'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
